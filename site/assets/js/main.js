(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');

  /* ---------- Fade-in sutil ao rolar ---------- */
  var faders = document.querySelectorAll('.fade');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // pequeno atraso escalonado entre irmãos
        var siblings = Array.prototype.filter.call(entry.target.parentNode.children, function (el) {
          return el.classList.contains('fade');
        });
        var index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = Math.min(index * 80, 320) + 'ms';
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    faders.forEach(function (el) { io.observe(el); });
  } else {
    faders.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Header e barra fixa mobile ---------- */
  var header = document.querySelector('.header');
  var sticky = document.querySelector('.sticky-cta');
  var offers = document.getElementById('ofertas');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    if (sticky && offers) {
      var r = offers.getBoundingClientRect();
      var overOffers = r.top < window.innerHeight && r.bottom > 0;
      sticky.classList.toggle('is-visible', y > 600 && !overOffers);
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Repasse de UTMs / click IDs para o checkout ---------- */
  var params = new URLSearchParams(window.location.search);
  var keep = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck', 'fbclid', 'gclid', 'ttclid'];
  var passthrough = [];
  keep.forEach(function (k) { if (params.get(k)) passthrough.push([k, params.get(k)]); });

  document.querySelectorAll('.js-checkout').forEach(function (a) {
    if (passthrough.length) {
      var url = new URL(a.href);
      passthrough.forEach(function (p) { url.searchParams.set(p[0], p[1]); });
      a.href = url.toString();
    }
  });

  /* ---------- Eventos para anúncios (GTM / GA4 / Meta Pixel) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(gaEvent, fbEvent, data) {
    window.dataLayer.push(Object.assign({ event: gaEvent }, data || {}));
    if (typeof window.fbq === 'function' && fbEvent) window.fbq('track', fbEvent, data || {});
  }

  document.querySelectorAll('.js-checkout').forEach(function (a) {
    a.addEventListener('click', function () {
      track('begin_checkout', 'InitiateCheckout', {
        currency: 'BRL',
        value: Number(a.dataset.value),
        content_name: 'Violine Shape kit ' + a.dataset.kit,
        num_items: Number(a.dataset.kit)
      });
    });
  });

  document.querySelectorAll('.js-whats').forEach(function (a) {
    a.addEventListener('click', function () { track('contact', 'Contact'); });
  });

  if (offers && 'IntersectionObserver' in window) {
    var seen = false;
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting && !seen) {
        seen = true;
        track('view_item', 'ViewContent', { currency: 'BRL', value: 247, content_name: 'Violine Shape' });
        obs.disconnect();
      }
    }, { threshold: 0.3 }).observe(offers);
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
