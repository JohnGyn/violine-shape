(function () {
  'use strict';

  // Só conta como compra (Pixel / GA4) quando o pagamento foi aprovado.
  if (document.body.dataset.status !== 'approved') return;

  // Evita contar a mesma compra duas vezes se a página for recarregada.
  var trackedKey = 'violine-purchase-tracked:' + window.location.href;
  try {
    if (sessionStorage.getItem(trackedKey)) return;
    sessionStorage.setItem(trackedKey, '1');
  } catch (e) {
    // sessionStorage indisponível (ex.: navegação privada): segue sem a proteção.
  }

  var params = new URLSearchParams(window.location.search);
  var value = Number(params.get('value') || params.get('valor'));
  var data = { currency: 'BRL' };
  if (isFinite(value) && value > 0) data.value = value;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: 'purchase' }, data));
  if (typeof window.fbq === 'function') window.fbq('track', 'Purchase', data);
})();
