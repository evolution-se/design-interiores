/* script.js — comportamentos globais do site Atelier Norte */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = "5511999999999"; // SUBSTITUIR pelo número real

  function buildWhatsAppUrl(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }
  window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  window.buildWhatsAppUrl = buildWhatsAppUrl;

  function applyWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp-message]').forEach(function (el) {
      var msg = el.getAttribute('data-whatsapp-message');
      el.setAttribute('href', buildWhatsAppUrl(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  }
  window.applyWhatsAppLinks = applyWhatsAppLinks;

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('js');

    // ---------- Header scroll ----------
    var header = document.querySelector('.site-header');
    var hero = document.querySelector('.hero');
    function updateHeader() {
      var scrolled = window.scrollY > 60;
      if (header) {
        header.classList.toggle('is-scrolled', scrolled);
        if (hero && !scrolled) header.classList.add('is-transparent');
        else header.classList.remove('is-transparent');
      }
    }
    // páginas internas: header sólido
    if (document.body.classList.contains('page-inner')) {
      if (header) header.classList.remove('is-transparent');
    } else {
      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
    }

    // ---------- Mobile menu ----------
    var toggle = document.querySelector('.nav-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    var header = document.querySelector('.site-header');
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function () {
        var open = mobileMenu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
        if (header) header.classList.toggle('menu-open', open);
      });
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobileMenu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          if (header) header.classList.remove('menu-open');
        });
      });
    }

    applyWhatsAppLinks();

    // ---------- FAQ accordion ----------
    document.querySelectorAll('.faq-accordion .accordion-button').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var target = document.querySelector(btn.getAttribute('data-bs-target'));
        if (!target) return;
        var willOpen = !target.classList.contains('show');
        // fecha os outros
        document.querySelectorAll('.faq-accordion .accordion-collapse.show').forEach(function (c) {
          if (c !== target) c.classList.remove('show');
        });
        document.querySelectorAll('.faq-accordion .accordion-button').forEach(function (b) {
          if (b !== btn) { b.classList.add('collapsed'); b.setAttribute('aria-expanded', 'false'); }
        });
        target.classList.toggle('show', willOpen);
        btn.classList.toggle('collapsed', !willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    // ---------- Scroll suave para âncoras ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // ---------- Reveal on scroll ----------
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    }

    // ---------- Back to top ----------
    var btt = document.querySelector('.back-to-top');
    if (btt) {
      window.addEventListener('scroll', function () {
        btt.classList.toggle('is-visible', window.scrollY > 600);
      }, { passive: true });
      btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // ---------- Image fade on load ----------
    document.querySelectorAll('img.img-fade').forEach(function (img) {
      if (img.complete) img.classList.add('is-loaded');
      else img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    });
  });
})();
/* ---- Portfolio filter ---- */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var filters = document.querySelectorAll('.portfolio-filter');
    var cards = document.querySelectorAll('.portfolio-card');
    var live = document.querySelector('.portfolio-live');
    if (!filters.length) return;
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        var count = 0;
        cards.forEach(function (card) {
          var c = card.getAttribute('data-category');
          var show = (cat === 'todos' || c === cat);
          card.classList.toggle('is-hidden', !show);
          if (show) count++;
        });
        if (live) live.textContent = 'Mostrando ' + count + ' projetos' + (cat !== 'todos' ? ' ' + cat.toLowerCase() + 's' : '');
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
    });
  });
})();

/* ---- Galeria modal ---- */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var modalEl = document.getElementById('galleryModal');
    if (!modalEl) return;
    var img = modalEl.querySelector('.modal-img');
    var counter = modalEl.querySelector('.modal-counter');
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    var idx = 0;
    function show(i) {
      idx = (i + items.length) % items.length;
      var src = items[idx].getAttribute('data-src');
      var alt = items[idx].getAttribute('data-alt') || '';
      img.setAttribute('src', src);
      img.setAttribute('alt', alt);
      if (counter) counter.textContent = (idx + 1) + ' / ' + items.length;
    }
    items.forEach(function (it, i) {
      it.addEventListener('click', function () {
        show(i);
        var m = bootstrap.Modal.getOrCreateInstance(modalEl);
        m.show();
      });
    });
    modalEl.querySelector('.modal-nav.prev').addEventListener('click', function () { show(idx - 1); });
    modalEl.querySelector('.modal-nav.next').addEventListener('click', function () { show(idx + 1); });
    modalEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    modalEl.addEventListener('shown.bs.modal', function () { document.body.style.overflow = 'hidden'; modalEl.focus(); });
    modalEl.addEventListener('hidden.bs.modal', function () { document.body.style.overflow = ''; });
  });
})();

/* ---- Formulário de contato ---- */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var phone = form.querySelector('input[name="telefone"]');
    if (phone) {
      phone.addEventListener('input', function () {
        var v = phone.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 6) v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
        else if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
        else if (v.length > 0) v = '(' + v;
        phone.value = v;
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.querySelector('[name="nome"]').value.trim();
      var tel = form.querySelector('[name="telefone"]').value.trim();
      var tipo = form.querySelector('[name="tipo"]').value;
      var loc = form.querySelector('[name="localizacao"]').value.trim();
      var estagio = form.querySelector('[name="estagio"]').value;
      var msg = form.querySelector('[name="mensagem"]').value.trim();
      var consent = form.querySelector('[name="consentimento"]');
      var errorBox = form.querySelector('.form-errors');
      var errors = [];
      if (!nome) errors.push('Informe seu nome.');
      if (!tel) errors.push('Informe seu telefone.');
      if (!tipo) errors.push('Selecione o tipo de projeto.');
      if (consent && !consent.checked) errors.push('É necessário concordar com a política de privacidade.');
      if (errorBox) {
        errorBox.innerHTML = errors.map(function (x) { return '<p>' + x + '</p>'; }).join('');
        errorBox.setAttribute('aria-live', 'polite');
      }
      form.querySelectorAll('input,select,textarea').forEach(function (f) {
        f.setAttribute('aria-invalid', errors.length ? 'true' : 'false');
      });
      if (errors.length) return;
      var text = 'Olá! Meu nome é ' + nome + '.\n' +
        'Tipo de projeto: ' + tipo + '.\n' +
        'Telefone: ' + tel + '.\n' +
        (loc ? 'Localização do imóvel: ' + loc + '.\n' : '') +
        (estagio ? 'Estágio: ' + estagio + '.\n' : '') +
        (msg ? 'Mensagem: ' + msg : '');
      window.open(window.buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
    });
  });
})();
