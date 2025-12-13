(async function () {
  const vaultCandidates = ['vault_wallet_2', 'wallet_1'];
  const balanceEl = document.getElementById('vault-balance');
  const usdEl = document.getElementById('vault-usd');
  const listEl = document.getElementById('vault-transfers');
  const panel = document.getElementById('vault-details-panel');
  const trigger = document.getElementById('vault-details-trigger');
  const burnListEl = document.getElementById('burn-transfers');
  const burnTotalEl = document.getElementById('burn-total');
  const burnSupplyEl = document.getElementById('burn-supply');
  const burnPanel = document.getElementById('burn-details-panel');
  const burnTrigger = document.getElementById('burn-details-trigger');

  const swapListEl = document.getElementById('swap-transfers');
  const swapPanel = document.getElementById('swap-details-panel');
  const swapTrigger = document.getElementById('swap-details-trigger');

  function formatNumber(value, opts = {}) {
    const { minimumFractionDigits = 4, maximumFractionDigits = 4 } = opts;
    return Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits,
    });
  }

  function formatUsd(value) {
    return '$' + Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function renderTransfers(listNode, transfers, { labelMode } = {}) {
    if (!listNode) return;
    listNode.innerHTML = '';
    transfers.forEach((tx) => {
      const li = document.createElement('li');
      const typeLine = document.createElement('div');
      typeLine.className = 'vault-transfer-type';

      const amount = document.createElement('div');
      amount.className = 'vault-transfer-amount';

      const raw = tx.amount || '';
      const isIn = typeof raw === 'string' && raw.trim().startsWith('+');

      if (labelMode === 'swap') {
        const label = isIn ? 'Swap' : 'Transfer';
        typeLine.textContent = label;
      } else if (labelMode === 'burn') {
        typeLine.textContent = '';
      } else {
        typeLine.textContent = isIn ? 'Inflow' : 'Transfer';
      }

      amount.textContent = labelMode === 'burn' ? raw : `${raw} tBTC`;
      if (!isIn) amount.classList.add('out');

      const link = document.createElement('a');
      link.className = 'vault-transfer-link';
      const href = tx.url || (tx.signature ? `https://solscan.io/tx/${tx.signature}` : '#');
      link.href = href;
      link.target = href === '#' ? '_self' : '_blank';
      link.rel = href === '#' ? '' : 'noopener noreferrer';
      link.textContent = 'Solscan';

      li.appendChild(typeLine);
      li.appendChild(amount);
      li.appendChild(link);
      listNode.appendChild(li);
    });
  }

  try {
    const [statusRes, burnRes, priceRes] = await Promise.all([
      fetch(`data/status.json?_=${Date.now()}`, { cache: 'no-store' }),
      fetch(`data/burn.json?_=${Date.now()}`, { cache: 'no-store' }),
      fetch(`data/price.json?_=${Date.now()}`, { cache: 'no-store' }),
    ]);

    if (!statusRes.ok) throw new Error('HTTP ' + statusRes.status);
    const data = await statusRes.json();
    const burnData = burnRes.ok ? await burnRes.json() : null;
    const priceData = priceRes.ok ? await priceRes.json() : null;

    const vault = vaultCandidates.map((k) => data[k]).find(Boolean);
    if (vault && balanceEl && usdEl && listEl) {
      balanceEl.textContent = formatNumber(vault.tbtc_balance, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
      usdEl.textContent = formatUsd(vault.tbtc_usd_value);

      const transfersAll = Array.isArray(vault.last_tbtc_transfers) ? vault.last_tbtc_transfers : [];
      const transfers = transfersAll.filter((tx) => typeof tx.amount === 'string' && tx.amount.trim().startsWith('+')).slice(0, 12);
      renderTransfers(listEl, transfers);
    }

    const swapData = data.wallet_1;
    if (swapData && swapListEl) {
      const swapsAll = Array.isArray(swapData.last_tbtc_transfers) ? swapData.last_tbtc_transfers : [];
      const swaps = swapsAll.slice(0, 12);
      renderTransfers(swapListEl, swaps, { labelMode: 'swap' });
    }

    if (burnData && burnListEl) {
      const burnsAll = Array.isArray(burnData.burns) ? burnData.burns : [];
      const burns = burnsAll.slice(0, 12).map((b) => {
        const formatted = formatNumber(b.amountUi, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return {
          amount: `-${formatted} Nummus`,
          url: b.url,
        };
      });
      renderTransfers(burnListEl, burns, { labelMode: 'burn' });
    }

    if (priceData) {
      if (burnTotalEl) {
        burnTotalEl.textContent = formatNumber(priceData.burnTotalTokens, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
      if (burnSupplyEl) {
        burnSupplyEl.textContent = formatNumber(priceData.totalSupplyTokens, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
    }
  } catch (err) {
    if (balanceEl) balanceEl.textContent = 'N/A';
    if (usdEl) usdEl.textContent = 'N/A';
    if (listEl) listEl.innerHTML = '<li>Errore nel caricamento dei dati</li>';
    if (swapListEl) swapListEl.innerHTML = '<li>Errore nel caricamento dei dati</li>';
    if (burnListEl) burnListEl.innerHTML = '<li>Errore nel caricamento dei dati</li>';
    if (burnTotalEl) burnTotalEl.textContent = 'N/A';
    if (burnSupplyEl) burnSupplyEl.textContent = 'N/A';
    console.error('Vault data error', err);
  }

  function setupHover(triggerNode, panelNode) {
    if (!triggerNode || !panelNode) return;

    let hideTimer;
    const show = () => {
      clearTimeout(hideTimer);
      panelNode.classList.add('active');
    };
    const hide = () => {
      hideTimer = setTimeout(() => panelNode.classList.remove('active'), 140);
    };

    [triggerNode, panelNode].forEach((node) => {
      node.addEventListener('mouseenter', show);
      node.addEventListener('mouseleave', hide);
      node.addEventListener('focusin', show);
      node.addEventListener('focusout', hide);
      node.addEventListener('wheel', show, { passive: true });
    });
  }

  setupHover(trigger, panel);
  setupHover(swapTrigger, swapPanel);
  setupHover(burnTrigger, burnPanel);
})();
