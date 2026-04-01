/* ══════════════════════════════════════════════════════
   VISTA REALTY SERVICES — script.js
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. NAVBAR — Scroll shrink & mobile menu
  ───────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const burger    = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Open / close mobile menu
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    }
  });


  /* ─────────────────────────────────────────
     2. SCROLL REVEAL
  ───────────────────────────────────────── */
  const revealItems = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────
     3. COUNTER ANIMATION — Trust Strip
  ───────────────────────────────────────── */
  const counters = [
    { el: document.getElementById('count1'), target: 10,   prefix: '',  suffix: '+',   duration: 1400 },
    { el: document.getElementById('count2'), target: 500,  prefix: '₹', suffix: 'Cr+', duration: 1800 },
    { el: document.getElementById('count3'), target: 1200, prefix: '',  suffix: '+',   duration: 2000 },
  ];

  let countersStarted = false;

  function animateCounter(config) {
    const { el, target, prefix, suffix, duration } = config;
    const start    = Date.now();
    const startVal = 0;

    function step() {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(startVal + (target - startVal) * ease);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const trustStrip = document.querySelector('.trust-strip');
  const trustObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(c => animateCounter(c));
      }
    });
  }, { threshold: 0.4 });
  if (trustStrip) trustObserver.observe(trustStrip);


  /* ─────────────────────────────────────────
     4. CAROUSEL
  ───────────────────────────────────────── */
  const track    = document.getElementById('carouselTrack');
  const slides   = document.querySelectorAll('.carousel__slide');
  const prevBtn  = document.getElementById('prevSlide');
  const nextBtn  = document.getElementById('nextSlide');
  const dotsWrap = document.getElementById('carouselDots');

  let current  = 0;
  let autoTimer;
  const totalSlides = slides.length;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function goNext() { goTo(current + 1); }
  function goPrev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { goNext(); resetAuto(); });
  prevBtn.addEventListener('click', () => { goPrev(); resetAuto(); });

  function startAuto() {
    autoTimer = setInterval(goNext, 5500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  // Swipe support
  let touchStartX = 0;
  const carouselEl = document.querySelector('.carousel');

  carouselEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carouselEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext(); else goPrev();
      resetAuto();
    }
  }, { passive: true });


  /* ─────────────────────────────────────────
     5. ACCORDION — FAQ
  ───────────────────────────────────────── */
  const triggers = document.querySelectorAll('.accordion__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-target');
      const body     = document.getElementById(targetId);
      const isOpen   = body.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion__body').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.accordion__trigger').forEach(t => t.classList.remove('active'));

      // Open clicked (if wasn't open)
      if (!isOpen) {
        body.classList.add('open');
        trigger.classList.add('active');
      }
    });
  });


  /* ─────────────────────────────────────────
     6. CONTACT FORM — Submission Handling
  ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.btn--gold-full');
      const originalText = btn.innerHTML;

      // Loading state
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.style.opacity = '0.8';
      btn.disabled = true;

      // Simulate submission (replace with real API)
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent — We\'ll be in touch soon!';
        btn.style.background = '#2e7d42';
        btn.style.opacity = '1';

        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 1500);
    });
  }


  /* ─────────────────────────────────────────
     7. ACTIVE NAV LINK on scroll
  ───────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--gold-light)'
            : '';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => sectionObserver.observe(section));


  /* ─────────────────────────────────────────
     8. SMOOTH SCROLL for all anchor links
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────
     9. HERO — Stagger animate on load
  ───────────────────────────────────────── */
  const heroItems = document.querySelectorAll('.hero__content .reveal-up');
  setTimeout(() => {
    heroItems.forEach(item => item.classList.add('is-visible'));
  }, 200);


  /* ─────────────────────────────────────────
     10. PARALLAX — Hero geo shapes
  ───────────────────────────────────────── */
  const geo1 = document.querySelector('.geo1');
  const geo2 = document.querySelector('.geo2');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight) {
      if (geo1) geo1.style.transform = `translateY(${sy * 0.12}px)`;
      if (geo2) geo2.style.transform = `translateY(${sy * -0.08}px)`;
    }
  }, { passive: true });


  /* ─────────────────────────────────────────
     11. SERVICE CARDS — stagger on scroll
  ───────────────────────────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, idx * 80);
      }
    });
  }, { threshold: 0.1 });

  serviceCards.forEach(card => {
    if (!card.classList.contains('reveal-up')) {
      card.classList.add('reveal-up');
    }
    cardObserver.observe(card);
  });


  /* ─────────────────────────────────────────
     12. PIN PULSE — stagger animation
  ───────────────────────────────────────── */
  const pins = document.querySelectorAll('.pin-dot');
  pins.forEach((pin, i) => {
    pin.style.animationDelay = `${i * 0.8}s`;
  });

});
