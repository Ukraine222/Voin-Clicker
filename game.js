document.addEventListener('DOMContentLoaded',function(){
  function formatNumber(num){
    if(num>=1000000){
      return(num/1000000).toFixed(1)+'M';
    }
    return num.toLocaleString('ru');
  }
  function showNotification(message){
    const container=document.getElementById('notification-container');
    if(!container)return;
    const notification=document.createElement('div');
    notification.className='notification bonus-notification';
    notification.textContent=message;
    container.appendChild(notification);
    setTimeout(function(){
      notification.classList.add('fade-out');
      setTimeout(function(){
        notification.remove();
      },500);
    },2500);
  }
  let state={
    uah:parseInt(localStorage.getItem('uah'))||0,
    usd:parseInt(localStorage.getItem('usd'))||0,
    eur:parseInt(localStorage.getItem('eur'))||0,
    btc:parseInt(localStorage.getItem('btc'))||0,
    clickValue:parseInt(localStorage.getItem('clickValue'))||1,
    minuteBonus:parseInt(localStorage.getItem('minuteBonus'))||0,
    hourlyBonus:parseInt(localStorage.getItem('hourlyBonus'))||0,
    dailyBonus:parseInt(localStorage.getItem('dailyBonus'))||0,
    casinoMode:localStorage.getItem('casinoMode')||'standard',
    liveMinerBought:localStorage.getItem('liveMiner')==='true',
    minerIncome:parseFloat(localStorage.getItem('minerIncome'))||0,
    promoHistory:JSON.parse(localStorage.getItem('promoHistory'))||[],
    fleaMarketCooldown:parseInt(localStorage.getItem('fleaMarketCooldown'))||0,
    fleaMarketPurchase:localStorage.getItem('fleaMarketPurchase')==='true',
    fleaMarketItems:JSON.parse(localStorage.getItem('fleaMarketItems'))||[],
    clickStreak:parseInt(localStorage.getItem('clickStreak'))||0,
    lastClickTime:parseInt(localStorage.getItem('lastClickTime'))||0,
    username:localStorage.getItem('username')||'Player'+Math.floor(Math.random()*1000)
  };
  const isNewUser=!localStorage.getItem('initialized');
  if(isNewUser){
    state={
      uah:0,
      usd:0,
      eur:0,
      btc:0,
      clickValue:1,
      minuteBonus:0,
      hourlyBonus:0,
      dailyBonus:0,
      casinoMode:'standard',
      liveMinerBought:false,
      minerIncome:0,
      promoHistory:[],
      fleaMarketCooldown:0,
      fleaMarketPurchase:false,
      fleaMarketItems:[],
      clickStreak:0,
      lastClickTime:0,
      username:'Player'+Math.floor(Math.random()*1000)
    };
    localStorage.setItem('initialized','true');
    localStorage.setItem('username',state.username);
    if(window.chevrons){
      window.chevrons.forEach(function(c){
        localStorage.setItem(`chevron_${c.id}`,'false');
      });
    }
    ['upgrade1','upgrade2','upgrade3','upgrade4','upgrade5','upgrade6','liveMiner'].forEach(function(key){
      localStorage.setItem(key,'false');
    });
    localStorage.setItem('promoHistory',JSON.stringify([]));
    localStorage.setItem('fleaMarketCooldown','0');
    localStorage.setItem('fleaMarketPurchase','false');
    localStorage.setItem('fleaMarketItems',JSON.stringify([]));
    localStorage.setItem('clickStreak','0');
    localStorage.setItem('lastClickTime','0');
  }
  const els={
    uah:document.getElementById('uah'),
    usd:document.getElementById('usd'),
    eur:document.getElementById('eur'),
    btc:document.getElementById('btc'),
    coin:document.getElementById('coin'),
    inventory:document.getElementById('inventory-list'),
    bonus:document.getElementById('bonusButton'),
    minuteBonusTimer:document.getElementById('minuteBonusTimer'),
    minuteBonusLabel:document.getElementById('minuteBonusLabel'),
    hourly:document.getElementById('hourlyBonusButton'),
    hourlyBonusTimer:document.getElementById('hourlyBonusTimer'),
    hourlyBonusLabel:document.getElementById('hourlyBonusLabel'),
    daily:document.getElementById('dailyBonusButton'),
    dailyBonusTimer:document.getElementById('dailyBonusTimer'),
    bet:document.getElementById('placeBet'),
    betAmount:document.getElementById('betAmount'),
    casinoResult:document.getElementById('casinoResult'),
    convertAmount:document.getElementById('convertAmount'),
    convertAmountDisplay:document.getElementById('convertAmountDisplay'),
    from:document.getElementById('fromCurrency'),
    to:document.getElementById('toCurrency'),
    convert:document.getElementById('convertButton'),
    convertProgress:document.getElementById('convertProgress'),
    convertProgressFill:document.getElementById('convertProgressFill'),
    convertResult:document.getElementById('convertResult'),
    promo:document.getElementById('promoInput'),
    redeem:document.getElementById('redeemPromo'),
    promoResult:document.getElementById('promoResult'),
    promoHistory:document.getElementById('promoHistory'),
    fleaMarketTimer:document.getElementById('fleaMarketTimer'),
    fleaMarketItems:document.getElementById('fleaMarketItems'),
    minerIncomeAmount:document.getElementById('minerIncomeAmount'),
    claimMinerIncome:document.getElementById('claimMinerIncome'),
    clickProgressFill:document.getElementById('clickProgressFill'),
    clickProgressText:document.getElementById('clickProgressText'),
    brigadesList:document.getElementById('brigades-list'),
    minerIncomePanel:document.getElementById('minerIncomePanel'),
    playersList:document.getElementById('players-list'),
    playerChevrons:document.getElementById('player-chevrons')
  };
  const upgrades=[
    {id:'upgrade1',name:'Двойной клик',cost:150,value:2,currency:'uah',bought:localStorage.getItem('upgrade1')==='true'},
    {id:'upgrade2',name:'Тройной клик',cost:350,value:3,currency:'uah',bought:localStorage.getItem('upgrade2')==='true'},
    {id:'upgrade3',name:'Мегаклик',cost:1000,value:5,currency:'uah',bought:localStorage.getItem('upgrade3')==='true'},
    {id:'upgrade4',name:'Титанический Удар',cost:20000,value:10,currency:'uah',bought:localStorage.getItem('upgrade4')==='true'},
    {id:'upgrade5',name:'Молниеносный Удар',cost:50000,value:20,currency:'uah',bought:localStorage.getItem('upgrade5')==='true'},
    {id:'upgrade6',name:'Ядерный Клик',cost:3,value:50,currency:'btc',bought:localStorage.getItem('upgrade6')==='true'},
    {id:'liveMiner',name:'Live майнер',cost:9000,value:40,currency:'uah',bought:localStorage.getItem('liveMiner')==='true'}
  ];
  const rareChevrons=['chevron10','chevron19','chevron20'];
  const fakePlayers=[
    {id:'player1',username:'Игрок1',chevrons:[{id:'chevron1',name:'Шеврон Огня',class:'rare',image:''},{id:'chevron2',name:'Шеврон Льда',class:'epic',image:''}]},
    {id:'player2',username:'Игрок2',chevrons:[{id:'chevron3',name:'Шеврон Молнии',class:'legendary',image:''}]},
    {id:'player3',username:'Игрок3',chevrons:[{id:'chevron4',name:'Шеврон Тьмы',class:'mythic',image:''},{id:'chevron5',name:'Шеврон Света',class:'ultra',image:''}]}
  ];
  window.buyChevron=function(id){
    const chevron=window.chevrons?.find(function(c){
      return c.id===id;
    });
    if(!chevron||!chevron.costs||localStorage.getItem(`chevron_${id}`)==='true'){
      return false;
    }
    const currency=Object.keys(chevron.costs)[0];
    const cost=chevron.costs[currency];
    if(state[currency]>=cost){
      state[currency]-=cost;
      localStorage.setItem(`chevron_${id}`,'true');
      localStorage.setItem(currency,state[currency]);
      showNotification(`Шеврон "${chevron.name}" куплен!`);
      updateDisplay();
      return true;
    }
    showNotification(`Недостаточно ${currency.toUpperCase()} для покупки "${chevron.name}"!`);
    return false;
  };
  function renderUpgrades(){
    const upgradesList=document.getElementById('upgrades');
    if(!upgradesList){
      return;
    }
    upgradesList.innerHTML='';
    upgrades.forEach(function(u){
      if(u.value<=state.clickValue&&u.id!=='liveMiner'){
        return;
      }
      const div=document.createElement('div');
      div.className='upgrade';
      div.dataset.upgrade=u.id;
      const currencySymbol={uah:'₴',usd:'$',eur:'€',btc:'₿'}[u.currency];
      div.innerHTML=`
        <p>${u.name}: ${u.id==='liveMiner'?`+40 ₴/сек`:`${u.value} ₴/клик`}</p>
        <p>Стоимость: ${formatNumber(u.cost)} ${currencySymbol}</p>
        <button ${u.bought?'disabled':''}>${u.bought?'Куплено':'Купить'}</button>
      `;
      div.querySelector('button').addEventListener('click',function(){
        if(!u.bought&&state[u.currency]>=u.cost){
          state[u.currency]-=u.cost;
          if(u.id==='liveMiner'){
            state.liveMinerBought=true;
            localStorage.setItem('liveMiner','true');
            if(els.minerIncomePanel){
              els.minerIncomePanel.style.display='block';
            }
          }else{
            state.clickValue=u.value;
            localStorage.setItem('clickValue',state.clickValue);
          }
          u.bought=true;
          localStorage.setItem(u.id,'true');
          localStorage.setItem(u.currency,state[u.currency]);
          showNotification(`Улучшение "${u.name}" куплено!`);
          updateDisplay();
        }else{
          showNotification(`Недостаточно ${u.currency.toUpperCase()} для покупки улучшения!`);
        }
      });
      upgradesList.appendChild(div);
    });
    if(els.minerIncomePanel){
      els.minerIncomePanel.innerHTML=`
        <p>Доход Live Miner: <span id="minerIncomeAmount">${formatNumber(state.minerIncome.toFixed(2))}</span> ₴</p>
        <button id="claimMinerIncome" ${!state.liveMinerBought?'disabled':''}>Собрать доход</button>
      `;
      els.minerIncomePanel.style.display=state.liveMinerBought?'block':'none';
      const claimButton=els.minerIncomePanel.querySelector('#claimMinerIncome');
      if(claimButton){
        claimButton.addEventListener('click',function(){
          if(!state.liveMinerBought){
            showNotification('Купите Live Miner!');
            return;
          }
          if(state.minerIncome>=1){
            const income=Math.floor(state.minerIncome);
            state.uah+=income;
            state.minerIncome=0;
            localStorage.setItem('uah',state.uah);
            localStorage.setItem('minerIncome',state.minerIncome);
            showNotification(`Собрано: ${income} ₴!`);
          }else{
            showNotification('Нет дохода для сбора!');
          }
          updateDisplay();
        });
      }
    }
  }
  function renderBrigades(){
    if(!els.brigadesList){
      return;
    }
    els.brigadesList.innerHTML='';
    if(!window.chevrons){
      return;
    }
    window.chevrons.forEach(function(c){
      if(!c.costs||typeof c.costs!=='object'){
        return;
      }
      const bought=localStorage.getItem(`chevron_${c.id}`)==='true';
      const div=document.createElement('div');
      div.className=`upgrade chevron ${c.class}`;
      div.dataset.chevronId=c.id;
      const currency=Object.keys(c.costs)[0];
      const currencySymbol={uah:'₴',usd:'$',eur:'€',btc:'₿'}[currency];
      const classText={mythic:'💎 Мифический',legendary:'🔥 Легендарный',ultra:'⚡️ Ультра',epic:'🌟 Эпический',rare:'✨ Редкий'}[c.class]||'Редкий';
      div.innerHTML=`
        <div class="chevron-preview" style="background-image: url('${c.image}')"></div>
        <p>${c.name}</p>
        <p>${formatNumber(c.costs[currency])} ${currencySymbol}</p>
        <p class="chevron-class">${classText}</p>
        <button ${bought?'disabled':''}>${bought?'Куплено':'Купить'}</button>
      `;
      div.querySelector('button').addEventListener('click',function(){
        window.buyChevron(c.id);
      });
      els.brigadesList.appendChild(div);
    });
  }
  function renderOnlinePlayers(){
    if(!els.playersList||!els.playerChevrons){
      return;
    }
    els.playersList.innerHTML='';
    fakePlayers.forEach(function(player){
      const div=document.createElement('div');
      div.className='player';
      div.dataset.playerId=player.id;
      div.innerHTML=`<p>${player.username}</p>`;
      div.addEventListener('click',function(){
        els.playerChevrons.innerHTML=player.chevrons.map(function(c){
          return`
            <div class="chevron ${c.class}">
              <div class="chevron-preview" style="background-image: url('${c.image||''}')">${c.image?'':'Нет изображения'}</div>
              <p>${c.name}</p>
              <p class="chevron-class">${{mythic:'💎 Мифический',legendary:'🔥 Легендарный',ultra:'⚡️ Ультра',epic:'🌟 Эпический',rare:'✨ Редкий'}[c.class]||'Редкий'}</p>
            </div>
          `;
        }).join('');
      });
      els.playersList.appendChild(div);
    });
  }
  function updateDisplay(){
    if(els.uah){
      els.uah.textContent=`₴${formatNumber(state.uah)}`;
    }
    if(els.usd){
      els.usd.textContent=`$${formatNumber(state.usd)}`;
    }
    if(els.eur){
      els.eur.textContent=`€${formatNumber(state.eur)}`;
    }
    if(els.btc){
      els.btc.textContent=`₿${formatNumber(state.btc)}`;
    }
    if(els.minerIncomeAmount){
      els.minerIncomeAmount.textContent=formatNumber(state.minerIncome.toFixed(2));
    }
    if(els.convertAmountDisplay&&els.convertAmount){
      els.convertAmountDisplay.textContent=formatNumber(els.convertAmount.value||0);
    }
    if(els.clickProgressText){
      els.clickProgressText.textContent=`${state.clickStreak} / 100 кликов`;
    }
    if(els.clickProgressFill){
      els.clickProgressFill.style.width=`${(state.clickStreak/100)*100}%`;
    }
    localStorage.setItem('uah',state.uah);
    localStorage.setItem('usd',state.usd);
    localStorage.setItem('eur',state.eur);
    localStorage.setItem('btc',state.btc);
    localStorage.setItem('clickValue',state.clickValue);
    localStorage.setItem('liveMiner',state.liveMinerBought);
    localStorage.setItem('minerIncome',state.minerIncome);
    localStorage.setItem('promoHistory',JSON.stringify(state.promoHistory));
    localStorage.setItem('fleaMarketCooldown',state.fleaMarketCooldown);
    localStorage.setItem('fleaMarketPurchase',state.fleaMarketPurchase);
    localStorage.setItem('fleaMarketItems',JSON.stringify(state.fleaMarketItems));
    localStorage.setItem('clickStreak',state.clickStreak);
    localStorage.setItem('lastClickTime',state.lastClickTime);
    localStorage.setItem('username',state.username);
    updateButtons();
    updateInventory();
    updateBonuses();
    updatePromoHistory();
    updateFleaMarket();
    renderBrigades();
    renderUpgrades();
    renderOnlinePlayers();
  }
  function updateButtons(){
    upgrades.forEach(function(u){
      const btn=document.querySelector(`[data-upgrade="${u.id}"] button`);
      if(btn){
        btn.disabled=u.bought||state[u.currency]<u.cost||(u.value<=state.clickValue&&u.id!=='liveMiner');
        btn.textContent=u.bought?'Куплено':'Купить';
      }
    });
    if(window.chevrons){
      window.chevrons.forEach(function(c){
        const btn=document.querySelector(`[data-chevron-id="${c.id}"] button`);
        if(btn&&c.costs&&typeof c.costs==='object'){
          const currency=Object.keys(c.costs)[0];
          const bought=localStorage.getItem(`chevron_${c.id}`)==='true';
          btn.disabled=bought||state[currency]<c.costs[currency];
          btn.textContent=bought?'Куплено':'Купить';
        }
      });
    }
  }
  function updateInventory(){
    const brigadesInventory=document.getElementById('brigades-inventory');
    if(!brigadesInventory){
      return;
    }
    brigadesInventory.innerHTML='';
    if(!window.chevrons){
      return;
    }
    window.chevrons.forEach(function(c){
      if(localStorage.getItem(`chevron_${c.id}`)!=='true'||!c.costs){
        return;
      }
      const div=document.createElement('div');
      div.className=`chevron ${c.class}`;
      const sellPrice=rareChevrons.includes(c.id)?0:Math.floor((c.costs.uah||c.costs.usd*2000||c.costs.eur*5000||c.costs.btc*100000||0)/2);
      div.innerHTML=`
        <div class="chevron-preview" style="background-image: url('${c.image}')"></div>
        <p>${c.name}</p>
        <button class="sell-button" style="display: none">${sellPrice>0?`Продать за ${formatNumber(sellPrice)} ₴`:'Нельзя продать'}</button>
      `;
      if(sellPrice>0){
        div.addEventListener('mouseenter',function(){
          div.querySelector('.sell-button').style.display='block';
        });
        div.addEventListener('mouseleave',function(){
          div.querySelector('.sell-button').style.display='none';
        });
        div.querySelector('.sell-button').addEventListener('click',function(){
          localStorage.setItem(`chevron_${c.id}`,'false');
          state.uah+=sellPrice;
          localStorage.setItem('uah',state.uah);
          showNotification(`Шеврон "${c.name}" продан за ${sellPrice} ₴!`);
          updateDisplay();
        });
      }
      brigadesInventory.appendChild(div);
    });
  }
  function showTab(id){
    document.querySelectorAll('.tab-content').forEach(function(t){
      t.style.display='none';
    });
    const tab=document.getElementById(id);
    if(tab){
      tab.style.display='block';
    }
    document.querySelectorAll('.tab-button').forEach(function(b){
      b.classList.remove('active');
    });
    const activeButton=document.querySelector(`[data-tab="${id}"]`);
    if(activeButton){
      activeButton.classList.add('active');
    }
    if(id==='brigades'){
      renderBrigades();
    }
    if(id==='inventory'){
      showInventorySubtab('brigades-inventory');
    }
    if(id==='upgrades'){
      renderUpgrades();
    }
    if(id==='players'){
      renderOnlinePlayers();
    }
  }
  function showInventorySubtab(subtabId){
    document.querySelectorAll('.inventory-subtab').forEach(function(t){
      t.classList.remove('active');
    });
    const subtab=document.getElementById(subtabId);
    if(subtab){
      subtab.classList.add('active');
    }
    document.querySelectorAll('.inventory-tab-button').forEach(function(b){
      b.classList.remove('active');
    });
    const activeButton=document.querySelector(`[data-subtab="${subtabId}"]`);
    if(activeButton){
      activeButton.classList.add('active');
    }
    updateInventory();
  }
  function updateBonuses(){
    if(els.minuteBonusLabel){
      els.minuteBonusLabel.textContent='500 ₴ в минуту';
    }
    if(state.minuteBonus>0){
      els.bonus.disabled=true;
      els.bonus.textContent='Получено!';
      if(els.minuteBonusTimer){
        els.minuteBonusTimer.style.display='inline-block';
        const minutes=Math.floor(state.minuteBonus/60);
        const seconds=state.minuteBonus%60;
        els.minuteBonusTimer.textContent=`500 ₴ через: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      }
    }else{
      els.bonus.disabled=false;
      els.bonus.textContent='Получить 500 ₴';
      if(els.minuteBonusTimer){
        els.minuteBonusTimer.style.display='none';
      }
    }
    if(els.hourlyBonusLabel){
      els.hourlyBonusLabel.textContent='5 € в час';
    }
    if(state.hourlyBonus>0){
      els.hourly.disabled=true;
      els.hourly.textContent='Получено!';
      if(els.hourlyBonusTimer){
        els.hourlyBonusTimer.style.display='inline-block';
        const minutes=Math.floor(state.hourlyBonus/60);
        const seconds=state.hourlyBonus%60;
        els.hourlyBonusTimer.textContent=`5 € через: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      }
    }else{
      els.hourly.disabled=false;
      els.hourly.textContent='Получить 5 €';
      if(els.hourlyBonusTimer){
        els.hourlyBonusTimer.style.display='none';
      }
    }
    if(state.dailyBonus>0){
      els.daily.disabled=true;
      els.daily.textContent='Получено!';
      if(els.dailyBonusTimer){
        els.dailyBonusTimer.style.display='inline-block';
        const hours=Math.floor(state.dailyBonus/3600);
        const minutes=Math.floor((state.dailyBonus%3600)/60);
        els.dailyBonusTimer.textContent=`1 ₿ через: ${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
      }
    }else{
      els.daily.disabled=false;
      els.daily.textContent='Получить 1 ₿';
      if(els.dailyBonusTimer){
        els.dailyBonusTimer.style.display='none';
      }
    }
  }
  function updatePromoHistory(){
    if(!els.promoHistory){
      return;
    }
    els.promoHistory.innerHTML='';
    state.promoHistory.forEach(function(promo){
      const div=document.createElement('div');
      div.className='promo-history-item';
      div.textContent=`${promo.code}: ${promo.reward}`;
      els.promoHistory.appendChild(div);
    });
  }
  function updateFleaMarket(){
    if(state.fleaMarketCooldown<=0){
      state.fleaMarketItems=[];
      state.fleaMarketPurchase=false;
      const availableChevrons=window.chevrons?window.chevrons.filter(function(c){
        return c&&c.id&&localStorage.getItem(`chevron_${c.id}`)!=='true';
      }):[];
      const selectedItems=[];
      while(selectedItems.length<3&&availableChevrons.length>0){
        const randomIndex=Math.floor(Math.random()*availableChevrons.length);
        selectedItems.push(availableChevrons.splice(randomIndex,1)[0]);
      }
      state.fleaMarketItems=selectedItems;
      state.fleaMarketCooldown=1800;
      localStorage.setItem('fleaMarketItems',JSON.stringify(state.fleaMarketItems));
      localStorage.setItem('fleaMarketPurchase',state.fleaMarketPurchase);
      localStorage.setItem('fleaMarketCooldown',state.fleaMarketCooldown);
    }
    const minutes=Math.floor(state.fleaMarketCooldown/60);
    const seconds=state.fleaMarketCooldown%60;
    if(els.fleaMarketTimer){
      els.fleaMarketTimer.textContent=state.fleaMarketCooldown>0?`Обновление через: ${minutes}m ${seconds.toString().padStart(2,'0')}s`:'Товары обновлены!';
    }
    if(!els.fleaMarketItems){
      return;
    }
    els.fleaMarketItems.innerHTML='';
    state.fleaMarketItems.forEach(function(item){
      if(!item||!item.id||!item.costs||typeof item.costs!=='object'){
        return;
      }
      const divItem=document.createElement('div');
      divItem.className=`upgrade chevron ${item.class}`;
      divItem.dataset.chevronId=item.id;
      const discountedCosts={};
      for(const key in item.costs){
        discountedCosts[key]=Math.floor(item.costs[key]*0.5);
      }
      const currency=Object.keys(discountedCosts)[0];
      const costText=`${formatNumber(discountedCosts[currency])} ${currency==='uah'?'₴':currency==='usd'?'$':currency==='eur'?'€':'₿'}`;
      const classText={mythic:'💎 Мифический',legendary:'🔥 Легендарный',ultra:'⚡️ Ультра',epic:'🌟 Эпический',rare:'✨ Редкий'}[item.class]||'Редкий';
      const isBought=localStorage.getItem(`chevron_${item.id}`)==='true';
      const isDisabled=state.fleaMarketPurchase||isBought;
      const buttonText=isBought?'Куплено!':state.fleaMarketPurchase?'Недоступно!':'Купить';
      divItem.innerHTML=`
        <div class="chevron-preview" style="background-image: url('${item.image||''}')"></div>
        <p>${item.name}</p>
        <p class="discount-price">Скидка 50%: ${costText}!</p>
        <p class="chevron-class">${classText}</p>
        <button ${isDisabled?'disabled':''}>${buttonText}</button>
      `;
      if(!isDisabled){
        divItem.querySelector('button').addEventListener('click',function(){
          const chevron=window.chevrons?.find(function(c){
            return c.id===item.id;
          });
          if(chevron){
            chevron.costs=discountedCosts;
            if(window.buyChevron(item.id)){
              state.fleaMarketPurchase=true;
              state.fleaMarketCooldown=1800;
              state.fleaMarketItems=[];
              const availableChevrons=window.chevrons?window.chevrons.filter(function(c){
                return c&&c.id&&localStorage.getItem(`chevron_${c.id}`)!=='true';
              }):[];
              const selectedItems=[];
              while(selectedItems.length<3&&availableChevrons.length>0){
                const randomIndex=Math.floor(Math.random()*availableChevrons.length);
                selectedItems.push(availableChevrons.splice(randomIndex,1)[0]);
              }
              state.fleaMarketItems=selectedItems;
              localStorage.setItem('fleaMarketPurchase','true');
              localStorage.setItem('fleaMarketCooldown',state.fleaMarketCooldown);
              localStorage.setItem('fleaMarketItems',JSON.stringify(state.fleaMarketItems));
              updateDisplay();
            }
          }
        });
      }
      els.fleaMarketItems.appendChild(divItem);
    });
  }
  if(els.coin){
    els.coin.addEventListener('click',function(){
      const currentTime=Date.now();
      const timeDiff=(currentTime-state.lastClickTime)/1000;
      if(timeDiff>2){
        state.clickStreak=0;
      }
      state.clickStreak++;
      state.lastClickTime=currentTime;
      if(state.clickStreak>=100){
        state.uah+=1000;
        state.clickStreak=0;
        localStorage.setItem('clickStreak',state.clickStreak);
        showNotification('Бонус за 100 кликов: 1000 ₴!');
      }
      state.uah+=state.clickValue;
      updateDisplay();
    });
  }
  if(els.bonus){
    els.bonus.addEventListener('click',function(){
      if(state.minuteBonus<=0){
        state.uah+=500;
        state.minuteBonus=60;
        showNotification(`Бонус получен: 500 ₴!`);
        localStorage.setItem('uah',state.uah);
        localStorage.setItem('minuteBonus',state.minuteBonus);
        updateDisplay();
      }
    });
  }
  if(els.hourly){
    els.hourly.addEventListener('click',function(){
      if(state.hourlyBonus<=0){
        state.eur+=5;
        state.hourlyBonus=3600;
        showNotification(`Бонус получен: 5 €!`);
        localStorage.setItem('eur',state.eur);
        localStorage.setItem('hourlyBonus',state.hourlyBonus);
        updateDisplay();
      }
    });
  }
  if(els.daily){
    els.daily.addEventListener('click',function(){
      if(state.dailyBonus<=0){
        state.btc+=1;
        state.dailyBonus=86400;
        showNotification(`Бонус получен: 1 ₿!`);
        localStorage.setItem('btc',state.btc);
        localStorage.setItem('dailyBonus',state.dailyBonus);
        updateDisplay();
      }
    });
  }
  function updateBetLimit(){
    if(!els.betAmount){
      return;
    }
    const mode=state.casinoMode;
    if(mode==='lucky'){
      els.betAmount.min=1000;
      els.betAmount.max=14000;
      els.betAmount.value=Math.max(1000,Math.min(14000,parseInt(els.betAmount.value)||1000));
    }else{
      els.betAmount.min=10;
      els.betAmount.max=10000;
      els.betAmount.value=Math.max(10,Math.min(10000,parseInt(els.betAmount.value)||10));
    }
  }
  document.querySelectorAll('.mode-button').forEach(function(btn){
    btn.addEventListener('click',function(){
      state.casinoMode=btn.dataset.mode;
      localStorage.setItem('casinoMode',state.casinoMode);
      document.querySelectorAll('.mode-button').forEach(function(b){
        b.classList.remove('active');
      });
      btn.classList.add('active');
      updateBetLimit();
      updateDisplay();
    });
  });
  if(els.bet){
    els.bet.addEventListener('click',function(){
      const bet=parseInt(els.betAmount.value)||0;
      const minBet=state.casinoMode==='lucky'?1000:10;
      const maxBet=state.casinoMode==='lucky'?14000:10000;
      if(isNaN(bet)||bet<minBet||bet>maxBet||state.uah<bet){
        showNotification(state.uah<bet?'Недостаточно ₴!':`Ставка должна быть от ${minBet} до ${maxBet} ₴!`);
        if(els.casinoResult){
          els.casinoResult.textContent=state.uah<bet?'Недостаточно ₴!':`Ставка от ${minBet} до ${maxBet} ₴`;
          els.casinoResult.classList.add('error');
          setTimeout(function(){
            els.casinoResult.textContent='';
            els.casinoResult.classList.remove('error');
          },2000);
        }
        return;
      }
      els.bet.disabled=true;
      let countdown=3;
      if(els.casinoResult){
        els.casinoResult.textContent=`${countdown}...`;
        els.casinoResult.classList.add('countdown');
      }
      const timer=setInterval(function(){
        countdown--;
        if(countdown>0){
          if(els.casinoResult){
            els.casinoResult.textContent=`${countdown}...`;
          }
        }else{
          clearInterval(timer);
          state.uah-=bet;
          localStorage.setItem('uah',state.uah);
          const modes={standard:{chance:50,multiplier:2},highRisk:{chance:30,multiplier:5},lucky:{chance:70,multiplier:2}};
          const{chance,multiplier}=modes[state.casinoMode]||modes.standard;
          const win=Math.random()*100<chance?Math.floor(bet*multiplier):0;
          if(win){
            state.uah+=win;
            localStorage.setItem('uah',state.uah);
            showNotification(`Вы выиграли ${win} ₴!`);
            if(els.casinoResult){
              els.casinoResult.textContent=`ВЫИГРЫШ: ${win} ₴!`;
              els.casinoResult.classList.add('win');
            }
          }else{
            showNotification('Проигрыш! Попробуйте снова!');
            if(els.casinoResult){
              els.casinoResult.textContent='ПРОИГРЫШ!';
              els.casinoResult.classList.add('error');
            }
          }
          setTimeout(function(){
            if(els.casinoResult){
              els.casinoResult.textContent='';
              els.casinoResult.classList.remove('win','error','countdown');
            }
            els.bet.disabled=false;
            updateDisplay();
          },2000);
        }
      },1000);
    });
  }
  if(els.convertAmount){
    els.convertAmount.addEventListener('input',function(){
      if(els.convertAmountDisplay){
        els.convertAmountDisplay.textContent=formatNumber(els.convertAmount.value||0);
      }
      updateDisplay();
    });
  }
  if(els.convert){
    els.convert.addEventListener('click',function(){
      const amount=parseFloat(els.convertAmount.value);
      const from=els.from?.value;
      const to=els.to?.value;
      const minAmounts={uah:100,usd:1,eur:1,btc:0.01};
      if(!from||!to||isNaN(amount)||amount<minAmounts[from]||from===to){
        showNotification(from===to?'Выберите разные валюты!':`Минимальная сумма: ${minAmounts[from]} ${from.toUpperCase()}!`);
        if(els.convertResult){
          els.convertResult.textContent=from===to?'Выберите разные валюты!':`Минимальная сумма: ${minAmounts[from]} ${from.toUpperCase()}!`;
        }
        return;
      }
      const rates={uah_usd:1/2000,uah_eur:1/5000,uah_btc:1/100000,usd_uah:2000,usd_eur:0.4,usd_btc:0.02,eur_uah:5000,eur_usd:2.5,eur_btc:0.05,btc_uah:100000,btc_usd:50,btc_eur:20};
      const key=`${from}_${to}`;
      if(!rates[key]){
        showNotification(`Обмен ${from.toUpperCase()} → ${to.toUpperCase()} недоступен!`);
        if(els.convertResult){
          els.convertResult.textContent=`Обмен ${from.toUpperCase()} → ${to.toUpperCase()} недоступен!`;
        }
        return;
      }
      if(state[from]<amount){
        showNotification(`Недостаточно средств!`);
        if(els.convertResult){
          els.convertResult.textContent=`Недостаточно средств!`;
        }
        return;
      }
      els.convert.disabled=true;
      if(els.convertProgress){
        els.convertProgress.style.display='block';
      }
      let progress=0;
      if(els.convertProgressFill){
        els.convertProgressFill.style.width='0%';
      }
      const interval=setInterval(function(){
        progress+=2;
        if(els.convertProgressFill){
          els.convertProgressFill.style.width=`${progress}%`;
        }
        if(progress>=100){
          clearInterval(interval);
          const converted=Math.floor(amount*rates[key]);
          state[from]-=amount;
          state[to]+=converted;
          localStorage.setItem(from,state[from]);
          localStorage.setItem(to,state[to]);
          showNotification(`Конвертировано: ${amount} ${from.toUpperCase()} → ${converted} ${to.toUpperCase()}!`);
          if(els.convertResult){
            els.convertResult.textContent=`Конвертировано: ${amount} ${from.toUpperCase()} → ${converted} ${to.toUpperCase()}!`;
          }
          if(els.convertProgress){
            els.convertProgress.style.display='none';
          }
          setTimeout(function(){
            if(els.convertResult){
              els.convertResult.textContent='';
            }
            els.convert.disabled=false;
            updateDisplay();
          },2000);
        }
      },60);
    });
  }
  if(els.redeem){
    els.redeem.addEventListener('click',function(){
      const promo=els.promo?.value?.toLowerCase().trim();
      const promos={};
      if(!promo||!promos[promo]||localStorage.getItem(`promo_${promo}`)==='true'){
        showNotification('Недействительный или уже использованный промокод!');
        if(els.promoResult){
          els.promoResult.textContent='Недействительный или уже использованный промокод!';
          els.promoResult.classList.add('error');
        }
        setTimeout(function(){
          if(els.promoResult){
            els.promoResult.textContent='';
            els.promoResult.classList.remove('error');
          }
          if(els.promo){
            els.promo.value='';
          }
        },1000);
        return;
      }
    });
  }
  document.querySelectorAll('.tab-button').forEach(function(btn){
    btn.addEventListener('click',function(){
      showTab(btn.dataset.tab);
    });
  });
  document.querySelectorAll('.inventory-tab-button').forEach(function(btn){
    btn.addEventListener('click',function(){
      showInventorySubtab(btn.dataset.subtab);
    });
  });
  document.querySelectorAll('.chevron-preview').forEach(function(preview){
    const img=new Image();
    const src=preview.style.backgroundImage?.slice(5,-2);
    if(src){
      img.src=src;
      img.onerror=function(){
        preview.style.backgroundImage='none';
        preview.style.backgroundColor='#ccc';
        preview.textContent='Изображение недоступно';
        preview.style.display='flex';
        preview.style.alignItems='center';
        preview.style.justifyContent='center';
        preview.style.color='#000';
        preview.style.fontSize='14px';
        preview.style.textAlign='center';
      };
    }
  });
  let isTabActive=!document.hidden;
  document.addEventListener('visibilitychange',function(){
    isTabActive=!document.hidden;
  });
  setInterval(function(){
    if(isTabActive&&state.liveMinerBought){
      state.minerIncome+=30;
      localStorage.setItem('minerIncome',state.minerIncome);
    }
    if(state.minuteBonus>0){
      state.minuteBonus--;
      localStorage.setItem('minuteBonus',state.minuteBonus);
    }
    if(state.hourlyBonus>0){
      state.hourlyBonus--;
      localStorage.setItem('hourlyBonus',state.hourlyBonus);
    }
    if(state.dailyBonus>0){
      state.dailyBonus--;
      localStorage.setItem('dailyBonus',state.dailyBonus);
    }
    if(state.fleaMarketCooldown>0){
      state.fleaMarketCooldown--;
      localStorage.setItem('fleaMarketCooldown',state.fleaMarketCooldown);
    }
    updateDisplay();
  },1000);
  updateDisplay();
});