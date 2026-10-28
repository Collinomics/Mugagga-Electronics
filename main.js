/* ============================================================
   Mugagga Electronics – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM Ready ─────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initHamburger();
    initActiveLink();
    initScrollTop();
    initIntersectionObserver();
    initCounters();
    initContactForm();
  });

  /* ── Navbar: scroll state ──────────────────────────────── */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Set initial state on load
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ── Hamburger menu ────────────────────────────────────── */
  function initHamburger() {
    var hamburger = document.getElementById('hamburger');
    var navMenu   = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;

    var label = hamburger.querySelector('.hamburger-label');

    function openMenu() {
      hamburger.classList.add('active');
      navMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      if (label) label.textContent = 'CLOSE';
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      if (label) label.textContent = 'MENU';
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on nav link click
    var navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* ── Active nav link ───────────────────────────────────── */
  function initActiveLink() {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';

    var navLinks = document.querySelectorAll('.nav-link[data-page]');
    navLinks.forEach(function (link) {
      var page = link.getAttribute('data-page');
      if (
        filename === page ||
        (filename === '' && page === 'index.html') ||
        (filename === 'index.html' && page === 'index.html')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ── Scroll-to-top button ──────────────────────────────── */
  function initScrollTop() {
    var btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── IntersectionObserver for animations ───────────────── */
  function initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var options = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Counter animation ─────────────────────────────────── */
  function initCounters() {
    var counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (counter) {
        counter.textContent = counter.getAttribute('data-target') + (counter.getAttribute('data-suffix') || '');
      });
      return;
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = null;
    var startValue = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease out quad
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = Math.floor(eased * (target - startValue) + startValue);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ── Contact form ──────────────────────────────────────── */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = form.querySelector('[name="name"]');
      var email   = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');
      var submitBtn = form.querySelector('[type="submit"]');

      // Clear previous alerts
      hideAlert();

      // Validation
      if (!name || name.value.trim().length < 2) {
        showAlert('Please enter your full name (at least 2 characters).', 'error');
        if (name) name.focus();
        return;
      }

      if (!email || !isValidEmail(email.value.trim())) {
        showAlert('Please enter a valid email address.', 'error');
        if (email) email.focus();
        return;
      }

      if (!message || message.value.trim().length < 10) {
        showAlert('Please enter a message (at least 10 characters).', 'error');
        if (message) message.focus();
        return;
      }

      // This static website has no message-delivery backend.
      // Never claim a message was delivered when nothing was sent.
      showAlert(
        'This demo form cannot send messages yet. Please contact Mugagga Electronics using the phone or email details on this page.',
        'error'
      );
      if (submitBtn) submitBtn.disabled = false;
    });
  }

  function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showAlert(message, type) {
    var alert = document.getElementById('formAlert');
    if (!alert) return;
    alert.textContent = message;
    alert.className = 'form-alert ' + type;
    alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    var alert = document.getElementById('formAlert');
    if (!alert) return;
    alert.textContent = '';
    alert.className = 'form-alert';
  }

})();
