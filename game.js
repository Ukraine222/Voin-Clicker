document.addEventListener('DOMContentLoaded', function () {
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    return num.toLocaleString('ru');
  }
  function showNotification(message) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className = 'notification bonus-notification';
    notification.textContent = message;
    container.appendChild(notification);
    setTimeout(function () {
      notification.classList.add('fade-out');
      setTimeout(function () {
        notification.remove();
      }, 500);
    }, 2500);
  }
  let state = {
    uah: parseInt(localStorage.getItem('uah')) || 0,
    usd: parseInt(localStorage.getItem('usd')) || 0,
    eur: parseInt(localStorage.getItem('eur')) || 0,
    btc: parseInt(localStorage.getItem('btc')) || 0,
    clickValue: JSON.parse(localStorage.getItem('clickValue')) || { uah: 1 },
    minuteBonus: parseInt(localStorage.getItem('minuteBonus')) || 0,
    hourlyBonus: parseInt(localStorage.getItem('hourlyBonus')) || 0,
    dailyBonus: parseInt(localStorage.getItem('dailyBonus')) || 0,
    casinoMode: localStorage.getItem('casinoMode') || 'standard',
    farmaBought: localStorage.getItem('farma') === 'true',
    farmaIncome: parseFloat(localStorage.getItem('farmaIncome')) || 0,
    promoHistory: JSON.parse(localStorage.getItem('promoHistory')) || [],
    fleaMarketCooldown: parseInt(localStorage.getItem('fleaMarketCooldown')) || 0,
    fleaMarketPurchase: localStorage.getItem('fleaMarketPurchase') === 'true',
    fleaMarketItems: JSON.parse(localStorage.getItem('fleaMarketItems')) || [],
    clickStreak: parseInt(localStorage.getItem('clickStreak')) || 0,
    lastClickTime: parseInt(localStorage.getItem('lastClickTime')) || 0,
    username: localStorage.getItem('username') || 'Player' + Math.floor(Math.random() * 1000)
  };
  const isNewUser = !localStorage.getItem('initialized');
  if (isNewUser) {
    state = {
      uah: 0,
      usd: 0,
      eur: 0,
      btc: 0,
      clickValue: { uah: 1 },
      minuteBonus: 0,
      hourlyBonus: 0,
      dailyBonus: 0,
      casinoMode: 'standard',
      farmaBought: false,
      farmaIncome: 0,
      promoHistory: [],
      fleaMarketCooldown: 0,
      fleaMarketPurchase: false,
      fleaMarketItems: [],
      clickStreak: 0,
      lastClickTime: 0,
      username: 'Player' + Math.floor(Math.random() * 1000)
    };
    localStorage.setItem('initialized', 'true');
    localStorage.setItem('username', state.username);
    if (window.chevrons) {
      window.chevrons.forEach(function (c) {
        localStorage.setItem(`chevron_${c.id}`, 'false');
      });
    }
    ['subscription_vplus', 'subscription_bronze', 'subscription_silver', 'subscription_gold', 'subscription_platinum', 'subscription_vip', 'farma'].forEach(function (key) {
      localStorage.setItem(key, 'false');
    });
    localStorage.setItem('promoHistory', JSON.stringify([]));
    localStorage.setItem('fleaMarketCooldown', '0');
    localStorage.setItem('fleaMarketPurchase', 'false');
    localStorage.setItem('fleaMarketItems', JSON.stringify([]));
    localStorage.setItem('clickStreak', '0');
    localStorage.setItem('lastClickTime', '0');
    localStorage.setItem('clickValue', JSON.stringify({ uah: 1 }));
  }
  const els = {
    uah: document.getElementById('uah'),
    usd: document.getElementById('usd'),
    eur: document.getElementById('eur'),
    btc: document.getElementById('btc'),
    coin: document.getElementById('coin'),
    inventory: document.getElementById('inventory-list'),
    bonus: document.getElementById('bonusButton'),
    minuteBonusTimer: document.getElementById('minuteBonusTimer'),
    minuteBonusLabel: document.getElementById('minuteBonusLabel'),
    hourly: document.getElementById('hourlyBonusButton'),
    hourlyBonusTimer: document.getElementById('hourlyBonusTimer'),
    hourlyBonusLabel: document.getElementById('hourlyBonusLabel'),
    daily: document.getElementById('dailyBonusButton'),
    dailyBonusTimer: document.getElementById('dailyBonusTimer'),
    bet: document.getElementById('placeBet'),
    betAmount: document.getElementById('betAmount'),
    casinoResult: document.getElementById('casinoResult'),
    convertAmount: document.getElementById('convertAmount'),
    convertAmountDisplay: document.getElementById('convertAmountDisplay'),
    from: document.getElementById('fromCurrency'),
    to: document.getElementById('toCurrency'),
    convert: document.getElementById('convertButton'),
    convertProgress: document.getElementById('convertProgress'),
    convertProgressFill: document.getElementById('convertProgressFill'),
    convertResult: document.getElementById('convertResult'),
    promo: document.getElementById('promoInput'),
    redeem: document.getElementById('redeemPromo'),
    promoResult: document.getElementById('promoResult'),
    promoHistory: document.getElementById('promoHistory'),
    fleaMarketTimer: document.getElementById('fleaMarketTimer'),
    fleaMarketItems: document.getElementById('fleaMarketItems'),
    farmaIncomeAmount: document.getElementById('farmaIncomeAmount'),
    claimFarmaIncome: document.getElementById('claimFarmaIncome'),
    clickProgressFill: document.getElementById('clickProgressFill'),
    clickProgressText: document.getElementById('clickProgressText'),
    brigadesList: document.getElementById('brigades-list'),
    farmaIncomePanel: document.getElementById('farmaIncomePanel'),
    playersList: document.getElementById('players-list'),
    playerChevrons: document.getElementById('player-chevrons')
  };
  const subscriptions = [
    { id: 'subscription_vplus', name: 'Подписка V+', cost: 20000, value: { uah: 5 }, currency: 'uah', class: 'subscription-vplus', bought: localStorage.getItem('subscription_vplus') === 'true' },
    { id: 'subscription_bronze', name: 'Подписка Bronze', cost: 50000, value: { uah: 10 }, currency: 'uah', class: 'subscription-bronze', bought: localStorage.getItem('subscription_bronze') === 'true' },
    { id: 'subscription_silver', name: 'Подписка Silver', cost: 75000, value: { uah: 20 }, currency: 'uah', class: 'subscription-silver', bought: localStorage.getItem('subscription_silver') === 'true' },
    { id: 'subscription_gold', name: 'Подписка Gold', cost: 150000, value: { uah: 50 }, currency: 'uah', class: 'subscription-gold', bought: localStorage.getItem('subscription_gold') === 'true' },
    { id: 'subscription_platinum', name: 'Подписка Platinum', cost: 250000, value: { usd: 1 }, currency: 'uah', class: 'subscription-platinum', bought: localStorage.getItem('subscription_platinum') === 'true' },
    { id: 'subscription_vip', name: 'Подписка VIP', cost: 25, value: { eur: 1 }, currency: 'btc', class: 'subscription-vip', bought: localStorage.getItem('subscription_vip') === 'true' },
    { id: 'farma', name: 'Farma', cost: 50, value: 30, currency: 'btc', class: 'subscription-farma', bought: localStorage.getItem('farma') === 'true' }
  ];
  const rareChevrons = ['chevron10', 'chevron19', 'chevron20'];
  const fakePlayers = [
    { id: 'player1', username: 'Игрок1', chevrons: [{ id: 'chevron1', name: 'Шеврон Огня', class: 'rare', image: '' }, { id: 'chevron2', name: 'Шеврон Льда', class: 'epic', image: '' }] },
    { id: 'player2', username: 'Игрок2', chevrons: [{ id: 'chevron3', name: 'Шеврон Молнии', class: 'legendary', image: '' }] },
    { id: 'player3', username: 'Игрок3', chevrons: [{ id: 'chevron4', name: 'Шеврон Тьмы', class: 'mythic', image: '' }, { id: 'chevron5', name: 'Шеврон Света', class: 'ultra', image: '' }] }
  ];
  window.buyChevron = function (id) {
    const chevron = window.chevrons?.find(function (c) {
      return c.id === id;
    });
    if (!chevron || !chevron.costs || localStorage.getItem(`chevron_${id}`) === 'true') {
      return false;
    }
    const currency = Object.keys(chevron.costs)[0];
    const cost = chevron.costs[currency];
    if (state[currency] >= cost) {
      state[currency] -= cost;
      localStorage.setItem(`chevron_${id}`, 'true');
      localStorage.setItem(currency, state[currency]);
      showNotification(`Шеврон "${chevron.name}" куплен!`);
      updateDisplay();
      return true;
    }
    showNotification(`Недостаточно ${currency.toUpperCase()} для покупки "${chevron.name}"!`);
    return false;
  };
  function renderSubscriptions() {
    const subscriptionsList = document.getElementById('subscriptions');
    if (!subscriptionsList) {
      return;
    }
    subscriptionsList.innerHTML = '';
    subscriptions.forEach(function (s) {
      const div = document.createElement('div');
      div.className = `upgrade-block ${s.class}`;
      div.id = s.id;
      const statusId = `status-${s.id.replace('subscription_', '')}`;
      const buttonId = s.id === 'farma' ? 'buyFarma' : `buy${s.name.replace('Подписка ', '')}`;
      let statusText = s.bought ? 'Куплено' : '';
      let statusColor = s.bought ? '#b7ffb7' : '';
      div.innerHTML = `
        <div class="upgrade-title">${s.name}</div>
        <div class="upgrade-desc">${s.id === 'farma' ? '+1800 ₴/мин' : Object.keys(s.value).map(c => `+${s.value[c]} ${c === 'uah' ? '₴' : c === 'usd' ? '$' : '€'} за 1 клик`).join('')}</div>
        <div class="upgrade-cost">Стоимость: ${formatNumber(s.cost)} ${s.currency === 'uah' ? '₴' : '₿'}</div>
        <div class="upgrade-status" id="${statusId}" style="color: ${statusColor}">${statusText}</div>
        <button id="${buttonId}" ${s.bought ? 'disabled' : ''}>Купить</button>
      `;
      const button = div.querySelector('button');
      button.addEventListener('click', function () {
        if (s.bought) return;
        if (state[s.currency] < s.cost) {
          showNotification(`Недостаточно ${s.currency.toUpperCase()} для покупки!`);
          return;
        }
        state[s.currency] -= s.cost;
        localStorage.setItem(s.currency, state[s.currency]);
        if (s.id === 'farma') {
          state.farmaBought = true;
          localStorage.setItem('farma', 'true');
          if (els.farmaIncomePanel) {
            els.farmaIncomePanel.style.display = 'block';
          }
        } else {
          localStorage.setItem(s.id, 'true');
          s.bought = true;
          updateClickValue();
        }
        showNotification(`Подписка "${s.name}" куплена!`);
        updateDisplay();
      });
      subscriptionsList.appendChild(div);
    });
    const farmaIncomePanel = document.createElement('div');
    farmaIncomePanel.className = 'upgrade-block subscription-farma';
    farmaIncomePanel.id = 'farmaIncomeBlock';
    farmaIncomePanel.innerHTML = `
      <div class="upgrade-title">Доход Farma</div>
      <div class="upgrade-desc"><span id="farmaIncomeAmount">${formatNumber(state.farmaIncome.toFixed(0))}</span> ₴</div>
      <button id="claimFarmaIncome" ${!state.farmaBought ? 'disabled' : ''}>Забрать</button>
    `;
    subscriptionsList.appendChild(farmaIncomePanel);
    const claimBtn = document.getElementById('claimFarmaIncome');
    if (claimBtn) {
      claimBtn.onclick = function () {
        if (!state.farmaBought) {
          showNotification('Купите Farma!');
          return;
        }
        if (state.farmaIncome >= 1) {
          const income = Math.floor(state.farmaIncome);
          state.uah += income;
          state.farmaIncome = 0;
          localStorage.setItem('uah', state.uah);
          localStorage.setItem('farmaIncome', state.farmaIncome);
          showNotification(`Собрано: ${income} ₴!`);
        } else {
          showNotification('Нет дохода для сбора!');
        }
        updateDisplay();
      };
    }
  }
  function renderBrigades() {
    if (!els.brigadesList) {
      return;
    }
    els.brigadesList.innerHTML = '';
    if (!window.chevrons) {
      return;
    }
    window.chevrons.forEach(function (c) {
      if (!c.costs || typeof c.costs !== 'object') {
        return;
      }
      const bought = localStorage.getItem(`chevron_${c.id}`) === 'true';
      const div = document.createElement('div');
      div.className = `upgrade chevron ${c.class}`;
      div.dataset.chevronId = c.id;
      const currency = Object.keys(c.costs)[0];
      const currencySymbol = { uah: '₴', usd: '$', eur: '€', btc: '₿' }[currency];
      const classText = { mythic: '💎 Мифический', legendary: '🔥 Легендарный', ultra: '⚡️ Ультра', epic: '🌟 Эпический', rare: '✨ Редкий' }[c.class] || 'Редкий';
      div.innerHTML = `
        <div class="chevron-preview" style="background-image: url('${c.image}')"></div>
        <p>${c.name}</p>
        <p>${formatNumber(c.costs[currency])} ${currencySymbol}</p>
        <p class="chevron-class">${classText}</p>
        <button ${bought ? 'disabled' : ''}>${bought ? 'Куплено' : 'Купить'}</button>
      `;
      div.querySelector('button').addEventListener('click', function () {
        window.buyChevron(c.id);
      });
      els.brigadesList.appendChild(div);
    });
  }
  function renderOnlinePlayers() {
    if (!els.playersList || !els.playerChevrons) {
      return;
    }
    els.playersList.innerHTML = '';
    fakePlayers.forEach(function (player) {
      const div = document.createElement('div');
      div.className = 'player';
      div.dataset.playerId = player.id;
      div.innerHTML = `<p>${player.username}</p>`;
      div.addEventListener('click', function () {
        els.playerChevrons.innerHTML = player.chevrons.map(function (c) {
          return `
            <div class="chevron ${c.class}">
              <div class="chevron-preview" style="background-image: url('${c.image || ''}')">${c.image ? '' : 'Нет изображения'}</div>
              <p>${c.name}</p>
              <p class="chevron-class">${{ mythic: '💎 Мифический', legendary: '🔥 Легендарный', ultra: '⚡️ Ультра', epic: '🌟 Эпический', rare: '✨ Редкий' }[c.class] || 'Редкий'}</p>
            </div>
          `;
        }).join('');
      });
      els.playersList.appendChild(div);
    });
  }
  function updateClickValue() {
    let clickValue = { uah: 1 };
    if (localStorage.getItem('subscription_vip') === 'true') {
      clickValue = { eur: 1 };
    } else if (localStorage.getItem('subscription_platinum') === 'true') {
      clickValue = { usd: 1 };
    } else if (localStorage.getItem('subscription_gold') === 'true') {
      clickValue = { uah: 50 };
    } else if (localStorage.getItem('subscription_silver') === 'true') {
      clickValue = { uah: 20 };
    } else if (localStorage.getItem('subscription_bronze') === 'true') {
      clickValue = { uah: 10 };
    } else if (localStorage.getItem('subscription_vplus') === 'true') {
      clickValue = { uah: 5 };
    }
    state.clickValue = clickValue;
    localStorage.setItem('clickValue', JSON.stringify(clickValue));
  }
  function updateDisplay() {
    if (els.uah) {
  const uahValueEl = document.getElementById('uah-value');
  if (uahValueEl) {
    uahValueEl.textContent = formatNumber(state.uah);
  }
}
if (els.usd) {
  const usdValueEl = document.getElementById('usd-value');
  if (usdValueEl) {
    usdValueEl.textContent = formatNumber(state.usd);
  }
}
if (els.eur) {
  const eurValueEl = document.getElementById('eur-value');
  if (eurValueEl) {
    eurValueEl.textContent = formatNumber(state.eur);
  }
}
if (els.btc) {
  const btcValueEl = document.getElementById('btc-value');
  if (btcValueEl) {
    btcValueEl.textContent = formatNumber(state.btc);
  }
}
if (els.farmaIncomeAmount) {
  els.farmaIncomeAmount.textContent = formatNumber(state.farmaIncome.toFixed(0));
}
    if (els.convertAmountDisplay && els.convertAmount) {
      els.convertAmountDisplay.textContent = formatNumber(els.convertAmount.value || 0);
    }
    if (els.clickProgressText) {
      els.clickProgressText.textContent = `${state.clickStreak} / 100 кликов`;
    }
    if (els.clickProgressFill) {
      els.clickProgressFill.style.width = `${(state.clickStreak / 100) * 100}%`;
    }
    localStorage.setItem('uah', state.uah);
    localStorage.setItem('usd', state.usd);
    localStorage.setItem('eur', state.eur);
    localStorage.setItem('btc', state.btc);
    localStorage.setItem('clickValue', JSON.stringify(state.clickValue));
    localStorage.setItem('farma', state.farmaBought);
    localStorage.setItem('farmaIncome', state.farmaIncome);
    localStorage.setItem('promoHistory', JSON.stringify(state.promoHistory));
    localStorage.setItem('fleaMarketCooldown', state.fleaMarketCooldown);
    localStorage.setItem('fleaMarketPurchase', state.fleaMarketPurchase);
    localStorage.setItem('fleaMarketItems', JSON.stringify(state.fleaMarketItems));
    localStorage.setItem('clickStreak', state.clickStreak);
    localStorage.setItem('lastClickTime', state.lastClickTime);
    localStorage.setItem('username', state.username);
    updateButtons();
    updateInventory();
    updateBonuses();
    updatePromoHistory();
    updateFleaMarket();
    renderBrigades();
    renderSubscriptions();
    renderOnlinePlayers();
  }
  function updateButtons() {
    subscriptions.forEach(function (s) {
      const btn = document.getElementById(s.id === 'farma' ? 'buyFarma' : `buy${s.name.replace('Подписка ', '')}`);
      if (btn) {
        btn.disabled = s.bought || (s.cost > 0 && state[s.currency] < s.cost);
        btn.textContent = s.bought ? 'Куплено' : 'Купить';
        const statusEl = document.getElementById(`status-${s.id.replace('subscription_', '')}`);
        if (statusEl) {
          if (s.bought) {
            statusEl.textContent = 'Куплено';
            statusEl.style.color = '#b7ffb7';
          } else if (s.cost > 0 && state[s.currency] < s.cost) {
            statusEl.textContent = `Недостаточно ${s.currency.toUpperCase()}`;
            statusEl.style.color = '#ff6666';
          } else {
            statusEl.textContent = 'Доступно';
            statusEl.style.color = '#ffffff';
          }
        }
      }
    });
    if (window.chevrons) {
      window.chevrons.forEach(function (c) {
        const btn = document.querySelector(`[data-chevron-id="${c.id}"] button`);
        if (btn && c.costs && typeof c.costs === 'object') {
          const currency = Object.keys(c.costs)[0];
          const bought = localStorage.getItem(`chevron_${c.id}`) === 'true';
          btn.disabled = bought || state[currency] < c.costs[currency];
          btn.textContent = bought ? 'Куплено' : 'Купить';
        }
      });
    }
  }
  function updateInventory() {
    const brigadesInventory = document.getElementById('brigades-inventory');
    if (!brigadesInventory) {
      return;
    }
    brigadesInventory.innerHTML = '';
    if (!window.chevrons) {
      return;
    }
    window.chevrons.forEach(function (c) {
      if (localStorage.getItem(`chevron_${c.id}`) !== 'true' || !c.costs) {
        return;
      }
      const div = document.createElement('div');
      div.className = `chevron ${c.class}`;
      const sellPrice = rareChevrons.includes(c.id) ? 0 : Math.floor((c.costs.uah || c.costs.usd * 2000 || c.costs.eur * 5000 || c.costs.btc * 100000 || 0) / 2);
      div.innerHTML = `
        <div class="chevron-preview" style="background-image: url('${c.image}')"></div>
        <p>${c.name}</p>
        <button class="sell-button" style="display: none">${sellPrice > 0 ? `Продать за ${formatNumber(sellPrice)} ₴` : 'Нельзя продать'}</button>
      `;
      if (sellPrice > 0) {
        div.addEventListener('mouseenter', function () {
          div.querySelector('.sell-button').style.display = 'block';
        });
        div.addEventListener('mouseleave', function () {
          div.querySelector('.sell-button').style.display = 'none';
        });
        div.querySelector('.sell-button').addEventListener('click', function () {
          localStorage.setItem(`chevron_${c.id}`, 'false');
          state.uah += sellPrice;
          localStorage.setItem('uah', state.uah);
          showNotification(`Шеврон "${c.name}" продан за ${sellPrice} ₴!`);
          updateDisplay();
        });
      }
      brigadesInventory.appendChild(div);
    });
  }
  function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(function (t) {
      t.style.display = 'none';
    });
    const tab = document.getElementById(id);
    if (tab) {
      tab.style.display = 'block';
    }
    document.querySelectorAll('.tab-button').forEach(function (b) {
      b.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-tab="${id}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
    if (id === 'brigades') {
      renderBrigades();
    } else if (id === 'inventory') {
      showInventorySubtab('brigades-inventory');
    } else if (id === 'subscriptions') {
      renderSubscriptions();
    } else if (id === 'players') {
      renderOnlinePlayers();
    }
  }
  function showInventorySubtab(subtabId) {
    document.querySelectorAll('.inventory-subtab').forEach(function (t) {
      t.classList.remove('active');
    });
    const subtab = document.getElementById(subtabId);
    if (subtab) {
      subtab.classList.add('active');
    }
    document.querySelectorAll('.inventory-tab-button').forEach(function (b) {
      b.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-subtab="${subtabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
    updateInventory();
  }
  function updateBonuses() {
    if (els.minuteBonusLabel) {
      els.minuteBonusLabel.textContent = '500 ₴ в минуту';
    }
    if (state.minuteBonus > 0) {
      els.bonus.disabled = true;
      els.bonus.textContent = 'Получено!';
      if (els.minuteBonusTimer) {
        els.minuteBonusTimer.style.display = 'inline-block';
        const minutes = Math.floor(state.minuteBonus / 60);
        const seconds = state.minuteBonus % 60;
        els.minuteBonusTimer.textContent = `500 ₴ через: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    } else {
      els.bonus.disabled = false;
      els.bonus.textContent = 'Получить 500 ₴';
      if (els.minuteBonusTimer) {
        els.minuteBonusTimer.style.display = 'none';
      }
    }
    if (els.hourlyBonusLabel) {
      els.hourlyBonusLabel.textContent = '5 € в час';
    }
    if (state.hourlyBonus > 0) {
      els.hourly.disabled = true;
      els.hourly.textContent = 'Получено!';
      if (els.hourlyBonusTimer) {
        els.hourlyBonusTimer.style.display = 'inline-block';
        const minutes = Math.floor(state.hourlyBonus / 60);
        const seconds = state.hourlyBonus % 60;
        els.hourlyBonusTimer.textContent = `5 € через: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    } else {
      els.hourly.disabled = false;
      els.hourly.textContent = 'Получить 5 €';
      if (els.hourlyBonusTimer) {
        els.hourlyBonusTimer.style.display = 'none';
      }
    }
    if (state.dailyBonus > 0) {
      els.daily.disabled = true;
      els.daily.textContent = 'Получено!';
      if (els.dailyBonusTimer) {
        els.dailyBonusTimer.style.display = 'inline-block';
        const hours = Math.floor(state.dailyBonus / 3600);
        const minutes = Math.floor((state.dailyBonus % 3600) / 60);
        els.dailyBonusTimer.textContent = `1 ₿ через: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    } else {
      els.daily.disabled = false;
      els.daily.textContent = 'Получить 1 ₿';
      if (els.dailyBonusTimer) {
        els.dailyBonusTimer.style.display = 'none';
      }
    }
  }
  function updatePromoHistory() {
    if (!els.promoHistory) {
      return;
    }
    els.promoHistory.innerHTML = '';
    state.promoHistory.forEach(function (promo) {
      const div = document.createElement('div');
      div.className = 'promo-history-item';
      div.textContent = `${promo.code}: ${promo.reward}`;
      els.promoHistory.appendChild(div);
    });
  }
  function updateFleaMarket() {
    if (state.fleaMarketCooldown <= 0) {
      state.fleaMarketItems = [];
      state.fleaMarketPurchase = false;
      const availableChevrons = window.chevrons ? window.chevrons.filter(function (c) {
        return c && c.id && localStorage.getItem(`chevron_${c.id}`) !== 'true';
      }) : [];
      const selectedItems = [];
      while (selectedItems.length < 3 && availableChevrons.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableChevrons.length);
        selectedItems.push(availableChevrons.splice(randomIndex, 1)[0]);
      }
      state.fleaMarketItems = selectedItems;
      state.fleaMarketCooldown = 1800;
      localStorage.setItem('fleaMarketItems', JSON.stringify(state.fleaMarketItems));
      localStorage.setItem('fleaMarketPurchase', state.fleaMarketPurchase);
      localStorage.setItem('fleaMarketCooldown', state.fleaMarketCooldown);
    }
    const minutes = Math.floor(state.fleaMarketCooldown / 60);
    const seconds = state.fleaMarketCooldown % 60;
    if (els.fleaMarketTimer) {
      els.fleaMarketTimer.textContent = state.fleaMarketCooldown > 0 ? `Обновление через: ${minutes}m ${seconds.toString().padStart(2, '0')}s` : 'Товары обновлены!';
    }
    if (!els.fleaMarketItems) {
      return;
    }
    els.fleaMarketItems.innerHTML = '';
    state.fleaMarketItems.forEach(function (item) {
      if (!item || !item.id || !item.costs || typeof item.costs !== 'object') {
        return;
      }
      const divItem = document.createElement('div');
      divItem.className = `upgrade chevron ${item.class}`;
      divItem.dataset.chevronId = item.id;
      const discountedCosts = {};
      for (const key in item.costs) {
        discountedCosts[key] = Math.floor(item.costs[key] * 0.5);
      }
      const currency = Object.keys(discountedCosts)[0];
      const costText = `${formatNumber(discountedCosts[currency])} ${currency === 'uah' ? '₴' : currency === 'usd' ? '$' : currency === 'eur' ? '€' : '₿'}`;
      const classText = { mythic: '💎 Мифический', legendary: '🔥 Легендарный', ultra: '⚡️ Ультра', epic: '🌟 Эпический', rare: '✨ Редкий' }[item.class] || 'Редкий';
      const isBought = localStorage.getItem(`chevron_${item.id}`) === 'true';
      const isDisabled = state.fleaMarketPurchase || isBought;
      const buttonText = isBought ? 'Куплено!' : state.fleaMarketPurchase ? 'Недоступно!' : 'Купить';
      divItem.innerHTML = `
        <div class="chevron-preview" style="background-image: url('${item.image || ''}')"></div>
        <p>${item.name}</p>
        <p class="discount-price">Скидка 50%: ${costText}!</p>
        <p class="chevron-class">${classText}</p>
        <button ${isDisabled ? 'disabled' : ''}>${buttonText}</button>
      `;
      if (!isDisabled) {
        divItem.querySelector('button').addEventListener('click', function () {
          const chevron = window.chevrons?.find(function (c) {
            return c.id === item.id;
          });
          if (chevron) {
            chevron.costs = discountedCosts;
            if (window.buyChevron(item.id)) {
              state.fleaMarketPurchase = true;
              state.fleaMarketCooldown = 1800;
              state.fleaMarketItems = [];
              const availableChevrons = window.chevrons ? window.chevrons.filter(function (c) {
                return c && c.id && localStorage.getItem(`chevron_${c.id}`) !== 'true';
              }) : [];
              const selectedItems = [];
              while (selectedItems.length < 3 && availableChevrons.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableChevrons.length);
                selectedItems.push(availableChevrons.splice(randomIndex, 1)[0]);
              }
              state.fleaMarketItems = selectedItems;
              localStorage.setItem('fleaMarketPurchase', 'true');
              localStorage.setItem('fleaMarketCooldown', state.fleaMarketCooldown);
              localStorage.setItem('fleaMarketItems', JSON.stringify(state.fleaMarketItems));
              updateDisplay();
            }
          }
        });
      }
      els.fleaMarketItems.appendChild(divItem);
    });
  }
  if (els.coin) {
    els.coin.addEventListener('click', function () {
      const currentTime = Date.now();
      const timeDiff = (currentTime - state.lastClickTime) / 1000;
      if (timeDiff > 2) {
        state.clickStreak = 0;
      }
      state.clickStreak++;
      state.lastClickTime = currentTime;
      if (state.clickStreak >= 100) {
        state.uah += 1000;
        state.clickStreak = 0;
        localStorage.setItem('clickStreak', state.clickStreak);
        showNotification('Бонус за 100 кликов: 1000 ₴!');
      }
      if (state.clickValue.uah) {
        state.uah += state.clickValue.uah;
      } else if (state.clickValue.usd) {
        state.usd += state.clickValue.usd;
      } else if (state.clickValue.eur) {
        state.eur += state.clickValue.eur;
      }
      localStorage.setItem('uah', state.uah);
      localStorage.setItem('usd', state.usd);
      localStorage.setItem('eur', state.eur);
      updateDisplay();
    });
  }
  if (els.bonus) {
    els.bonus.addEventListener('click', function () {
      if (state.minuteBonus <= 0) {
        state.uah += 500;
        state.minuteBonus = 60;
        showNotification(`Бонус получен: 500 ₴!`);
        localStorage.setItem('uah', state.uah);
        localStorage.setItem('minuteBonus', state.minuteBonus);
        updateDisplay();
      }
    });
  }
  if (els.hourly) {
    els.hourly.addEventListener('click', function () {
      if (state.hourlyBonus <= 0) {
        state.eur += 5;
        state.hourlyBonus = 3600;
        showNotification(`Бонус: 5 €!`);
        localStorage.setItem('eur', state.eur);
        localStorage.setItem('hourlyBonus', state.hourlyBonus);
        updateDisplay();
      }
    });
  }
  if (els.daily) {
    els.daily.addEventListener('click', function () {
      if (state.dailyBonus <= 0) {
        state.btc += 1;
        state.dailyBonus = 86400;
        showNotification(`Бонус: 1 ₿!`);
        localStorage.setItem('btc', state.btc);
        localStorage.setItem('dailyBonus', state.dailyBonus);
        updateDisplay();
      }
    });
  }
  function updateBetLimit() {
    if (!els.betAmount) {
      return;
    }
    const mode = state.casinoMode;
    if (mode === 'lucky') {
      els.betAmount.min = 1000;
      els.betAmount.max = 14000;
      els.betAmount.value = Math.max(1000, Math.min(14000, parseInt(els.betAmount.value) || 1000));
    } else {
      els.betAmount.min = 10;
      els.betAmount.max = 10000;
      els.betAmount.value = Math.max(10, Math.min(10000, parseInt(els.betAmount.value) || 10));
    }
  }
  document.querySelectorAll('.mode-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.casinoMode = btn.dataset.mode;
      localStorage.setItem('casinoMode', state.casinoMode);
      document.querySelectorAll('.mode-button').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      updateBetLimit();
      updateDisplay();
    });
  });
  if (els.bet) {
    els.bet.addEventListener('click', function () {
      const bet = parseInt(els.betAmount.value) || 0;
      const minBet = state.casinoMode === 'lucky' ? 1000 : 10;
      const maxBet = state.casinoMode === 'lucky' ? 14000 : 10000;
      if (isNaN(bet) || bet < minBet || bet > maxBet || state.uah < bet) {
        showNotification(state.uah < bet ? 'Недостаточно ₴!' : `Ставка должна быть от ${minBet} до ${maxBet} ₴!`);
        if (els.casinoResult) {
          els.casinoResult.textContent = state.uah < bet ? 'Недостаточно ₴!' : `Ставка от ${minBet} до ${maxBet} ₴`;
          els.casinoResult.classList.add('error');
          setTimeout(function () {
            els.casinoResult.textContent = '';
            els.casinoResult.classList.remove('error');
          }, 2000);
        }
        return;
      }
      els.bet.disabled = true;
      let countdown = 3;
      if (els.casinoResult) {
        els.casinoResult.textContent = `${countdown}...`;
        els.casinoResult.classList.add('countdown');
      }
      const timer = setInterval(function () {
        countdown--;
        if (countdown > 0) {
          if (els.casinoResult) {
            els.casinoResult.textContent = `${countdown}...`;
          }
        } else {
          clearInterval(timer);
          state.uah -= bet;
          localStorage.setItem('uah', state.uah);
          const modes = { standard: { chance: 50, multiplier: 2 }, highRisk: { chance: 30, multiplier: 5 }, lucky: { chance: 70, multiplier: 2 } };
          const { chance, multiplier } = modes[state.casinoMode] || modes.standard;
          const win = Math.random() * 100 < chance ? Math.floor(bet * multiplier) : 0;
          if (win) {
            state.uah += win;
            localStorage.setItem('uah', state.uah);
            showNotification(`Вы выиграли ${win} ₴!`);
            if (els.casinoResult) {
              els.casinoResult.textContent = `ВЫИГРЫШ: ${win} ₴!`;
              els.casinoResult.classList.add('win');
            }
          } else {
            showNotification('Проигрыш! Попробуйте еще! ');
            if (els.casinoResult) {
              els.casinoResult.textContent = 'ПРОИГРЫШ!';
              els.casinoResult.classList.add('error');
            }
          }
          setTimeout(function () {
            if (els.casinoResult) {
              els.casinoResult.textContent = '';
              els.casinoResult.classList.remove('win', 'error', 'countdown');
            }
            els.bet.disabled = false;
            updateDisplay();
          }, 2000);
        }
      }, 1000);
    });
  }
  if (els.convertAmount) {
    els.convertAmount.addEventListener('input', function () {
      if (els.convertAmountDisplay) {
        els.convertAmountDisplay.textContent = formatNumber(els.convertAmount.value || 0);
      }
      updateDisplay();
    });
  }
  if (els.convert) {
    els.convert.addEventListener('click', function () {
      const amount = parseFloat(els.convertAmount.value);
      const from = els.from?.value;
      const to = els.to?.value;
      const minAmounts = { uah: 100, usd: 1, eur: 1, btc: 0.01 };
      if (!from || !to || isNaN(amount) || amount < minAmounts[from] || from === to) {
        showNotification(from === to ? 'Выберите разные валюты!' : `Минимальная сумма: ${minAmounts[from]} ${from.toUpperCase()}!`);
        if (els.convertResult) {
          els.convertResult.textContent = from === to ? 'Выберите разные валюты!' : `Минимальная сумма: ${minAmounts[from]} ${from}!`;
        }
        return;
      }
      const rates = { uah_usd: 1 / 2000, uah_eur: 1 / 14000, uah_btc: 1 / 100000, usd_uah: 2000, usd_eur: 0.4, usd_btc: 0.02, eur_uah: 14000, eur_usd: 2.5, eur_btc: 0.05, btc_uah: 100000, btc_usd: 50, btc_eur: 20 };
      const key = `${from}_${to}`;
      if (!rates[key]) {
        showNotification(`Обмен ${from.toUpperCase()} → ${to.toUpperCase()} недоступен!`);
        return;
      }
      if (state[from] < amount) {
        showNotification(`Недостаточно средств!`);
        if (els.convertResult) {
          els.convertResult.textContent = 'Недостаточно!';
        }
        return;
      }
      els.convert.disabled = true;
      if (els.convertProgress) {
        els.convertProgress.style.display = 'block';
      }
      let progress = 0;
      if (els.convertProgressFill) {
        els.convertProgressFill.style.width = '0%';
      }
      const interval = setInterval(function () {
        progress += 2;
        if (els.convertProgressFill) {
          els.convertProgressFill.style.width = `${progress}%`;
        }
        if (progress >= 100) {
          clearInterval(interval);
          const converted = Math.floor(amount * rates[key]);
          state[from] -= amount;
          state[to] += converted;
          localStorage.setItem(from, state[from]);
          localStorage.setItem(to, state[to]);
          showNotification(`Конвертировано: ${amount} ${from.toUpperCase()} → ${converted} ${to.toUpperCase()}!`);
          if (els.convertResult) {
            els.convertResult.textContent = `Конвертация: ${amount} ${from.toUpperCase()} → ${converted} ${to.toUpperCase()}`;
          }
          if (els.convertProgress) {
            els.convertProgress.style.display = 'none';
          }
          setTimeout(function () {
            if (els.convertResult) {
              els.convertResult.textContent = '';
            }
            els.convert.disabled = false;
            updateDisplay();
          }, 2000);
        }
      }, 60);
    });
  }
  if (els.redeem) {
    els.redeem.addEventListener('click', function () {
      const promo = els.promo?.value?.toLowerCase().trim();
      const promos = {
        'tester5': {
          reward: '3 ₿ и шеврон "15"',
          action: function () {
            state.btc += 3;
            if (window.chevrons) {
              const chevron = window.chevrons.find(c => c.id === 'chevron15');
              if (chevron) {
                localStorage.setItem('chevron_15', 'true');
              }
            }
          }
        }
      };
      if (!promo || !promos[promo] || localStorage.getItem(`promo_${promo}`) === 'true') {
        showNotification('Недействительный или уже использованный промокод!');
        if (els.promoResult) {
          els.promoResult.textContent = 'Недействительный или использованный промокод!';
          els.promoResult.classList.add('error');
        }
        setTimeout(() => {
          if (els.promoResult) {
            els.promoResult.textContent = '';
            els.promoResult.classList.remove('error');
          }
          if (els.promo) {
            els.promo.value = '';
          }
        }, 1000);
        return;
      }
      promos[promo].action();
      localStorage.setItem(`promo_${promo}`, 'true');
      state.promoHistory.push({ code: promo, reward: promos[promo].reward });
      showNotification(`Промокод активирован: ${promos[promo].reward}`);
      if (els.promoResult) {
        els.promoResult.textContent = `Промокод активирован: ${promos[promo].reward}`;
        els.promoResult.classList.remove('error');
      }
      if (els.promo) {
        els.promo.value = '';
      }
      updateDisplay();
    });
  }
  document.querySelectorAll('.tab-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showTab(btn.dataset.tab);
    });
  });
  document.querySelectorAll('.inventory-tab-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showInventorySubtab(btn.dataset.subtab);
    });
  });
  document.querySelectorAll('.chevron-preview').forEach(function (preview) {
    const img = new Image();
    const src = preview.style.backgroundImage?.slice(1, -2);
    if (src) {
      img.src = src;
      img.onerror = function () {
        preview.style.backgroundImage = 'none';
        preview.style.backgroundColor = '#ccc';
        preview.textContent = 'Изображение недоступно';
        preview.style.display = 'flex';
        preview.style.alignItems = 'center';
        preview.style.justifyContent = 'center';
        preview.style.color = '#000';
        preview.style.fontSize = '14px';
        preview.style.textAlign = 'center';
      };
    }
  });
  let isTabActive = !document.hidden;
  document.addEventListener('visibilitychange', function () {
    isTabActive = !document.hidden;
  });
  setInterval(function () {
    if (isTabActive && state.farmaBought) {
      state.farmaIncome += 30; // 30 UAH per second
      localStorage.setItem('farmaIncome', state.farmaIncome);
    }
    if (state.minuteBonus > 0) {
      state.minuteBonus--;
      localStorage.setItem('minuteBonus', state.minuteBonus);
    }
    if (state.hourlyBonus > 0) {
      state.hourlyBonus--;
      localStorage.setItem('hourlyBonus', state.hourlyBonus);
    }
    if (state.dailyBonus > 0) {
      state.dailyBonus--;
      localStorage.setItem('dailyBonus', state.dailyBonus);
    }
    if (state.fleaMarketCooldown > 0) {
      state.fleaMarketCooldown--;
      localStorage.setItem('fleaMarketCooldown', state.fleaMarketCooldown);
    }
    updateDisplay();
  }, 1000);
  updateDisplay();
});