/* ============================================================
   RSMC main.js  —  Vanilla JS, no dependencies
   Handles: nav toggle, sticky shadow, active-link, reveal-on-
   scroll, FAQ accordion, donation widget, form validation,
   gallery lightbox, and dynamic content rendering from data/*.json
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Sticky header shadow + mobile nav toggle ---------- */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');

  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
    };

    const openMenu = () => {
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
    };

    const syncMenuState = () => {
      if (window.innerWidth > 960) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.removeAttribute('aria-hidden');
        document.body.classList.remove('nav-open');
      } else if (!menu.classList.contains('open')) {
        menu.setAttribute('aria-hidden', 'true');
      }
    };

    syncMenuState();

    toggle.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', syncMenuState);
  }

  /* ---------- 2. Highlight active nav link ---------- */
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
    if (href === here || (here === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- 3. Reveal-on-scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- 4. Stat counter animation ---------- */
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = Number.parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const finalValue = target.toLocaleString() + suffix;

    // Keep mobile pages stable: skip animation for users who prefer less motion
    // and ensure the final text is always set after one lightweight run.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      el.textContent = finalValue;
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || el.dataset.counted === 'true') return;
        el.dataset.counted = 'true';
        const dur = 900;
        const start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = Math.floor(target * eased);
          el.textContent = (p >= 1 ? target : v).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(e.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
  });

  /* ---------- 5. FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* ---------- 6. Donation widget ---------- */
  const donate = document.querySelector('[data-donate]');
  if (donate) {
    const amounts   = donate.querySelectorAll('.amount-btn');
    const custom    = donate.querySelector('#custom-amount');
    const impactEl  = donate.querySelector('[data-impact]');
    const freqBtns  = donate.querySelectorAll('.freq-toggle button');
    const ctaBtn    = donate.querySelector('[data-donate-cta]');
    let amount = 50, freq = 'one-time';

    const impacts = [
      { min: 0,   text: 'Every contribution makes a difference. Thank you.' },
      { min: 25,  text: 'PKR ' + (25*280).toLocaleString() + ' — provides a month of school supplies for one child.' },
      { min: 50,  text: 'PKR ' + (50*280).toLocaleString() + ' — funds a free health check-up for a family.' },
      { min: 100, text: 'PKR ' + (100*280).toLocaleString() + ' — feeds a family of five for two weeks.' },
      { min: 250, text: 'PKR ' + (250*280).toLocaleString() + ' — sponsors vocational training for one woman for a month.' },
      { min: 500, text: 'PKR ' + (500*280).toLocaleString() + ' — funds a community medical camp serving 50+ patients.' }
    ];
    const updateImpact = (v) => {
      const i = impacts.slice().reverse().find(x => v >= x.min) || impacts[0];
      if (impactEl) impactEl.textContent = i.text;
      if (ctaBtn) ctaBtn.textContent = (freq === 'monthly' ? 'Give $' : 'Donate $') + (v || 0) + (freq === 'monthly' ? ' / month' : '');
    };

    amounts.forEach(b => b.addEventListener('click', () => {
      amounts.forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      amount = parseInt(b.dataset.amount, 10);
      if (custom) custom.value = '';
      updateImpact(amount);
    }));
    if (custom) {
      custom.addEventListener('input', () => {
        amounts.forEach(x => x.classList.remove('selected'));
        amount = parseInt(custom.value || '0', 10);
        updateImpact(amount);
      });
    }
    freqBtns.forEach(b => b.addEventListener('click', () => {
      freqBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      freq = b.dataset.freq;
      updateImpact(amount);
    }));
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        if (!amount || amount < 1) { alert('Please enter a donation amount.'); return; }
        alert(
          'Thank you for your generosity!\n\n' +
          'Amount: $' + amount + (freq === 'monthly' ? ' / month' : '') + '\n\n' +
          'In production, this would securely redirect to a payment gateway ' +
          '(Stripe, PayPal, JazzCash, EasyPaisa, or bank transfer). ' +
          'Please see the “Other ways to give” section below for bank details.'
        );
      });
    }
    updateImpact(amount);
  }

  /* ---------- 7. Contact / Volunteer form validation ---------- */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-msg');
      let valid = true;
      form.querySelectorAll('[required]').forEach(f => {
        if (!f.value.trim()) { valid = false; f.style.borderColor = '#c0584b'; }
        else { f.style.borderColor = ''; }
      });
      const email = form.querySelector('input[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false; email.style.borderColor = '#c0584b';
      }
      if (!valid) {
        if (msg) { msg.className = 'form-msg error'; msg.textContent = 'Please complete all required fields with valid information.'; }
        return;
      }
      if (msg) {
        msg.className = 'form-msg success';
        msg.textContent = 'Thank you! Your message has been received. Our team will be in touch within 2 business days.';
      }
      form.reset();
      // To wire up to a real backend: replace with fetch() to your endpoint
      // e.g. Formspree, Netlify Forms, Web3Forms, or your own API.
    });
  });

  /* ---------- 8. Gallery lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg   = lightbox.querySelector('img');
    const closeBtn= lightbox.querySelector('.lightbox-close');
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img').src;
        lbImg.src = src; lbImg.alt = item.querySelector('img').alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const close = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ---------- 9. Dynamic content from JSON (optional)
        Any element with [data-load="news"] will be populated
        from /data/news.json — letting non-technical staff edit
        content by editing one JSON file. ---------- */
  const fallbackNews = [
    {
      title: 'Free Medical Camp Serves 320 Patients in Multan',
      date: '15 May 2026',
      category: 'Healthcare',
      excerpt: 'Our two-day mobile medical camp in District Multan provided free consultations, medicines and screenings to 320 women and children from under-served communities.',
      image: 'images/program-health.jpg'
    },
    {
      title: '100 New Scholarships Awarded for the 2026 Academic Year',
      date: '02 Apr 2026',
      category: 'Education',
      excerpt: 'RSMC awarded 100 full-tuition scholarships to deserving girls across rural Punjab, covering books, uniforms and exam fees.',
      image: 'images/program-education.jpg'
    },
    {
      title: 'Ramadan Ration Drive Reaches 1,200 Families',
      date: '18 Mar 2026',
      category: 'Food Relief',
      excerpt: 'With the help of 75 volunteers, we distributed monthly ration packs to 1,200 families during Ramadan.',
      image: 'images/program-food.jpg'
    },
    {
      title: 'Sewing Centre Graduates 40 Women in Bahawalpur',
      date: '20 Feb 2026',
      category: 'Women Empowerment',
      excerpt: 'Forty women completed our six-month tailoring and entrepreneurship program and received support to launch home-based businesses.',
      image: 'images/program-women.jpg'
    },
    {
      title: 'Clean Water Hand-Pump Installed in Cholistan Village',
      date: '11 Jan 2026',
      category: 'Community',
      excerpt: 'A new solar-powered hand-pump now serves over 400 residents and reduces the daily burden of collecting clean drinking water.',
      image: 'images/hero.jpg'
    },
    {
      title: 'Annual Impact Report 2025 Now Available',
      date: '05 Jan 2026',
      category: 'Reports',
      excerpt: 'Read about lives touched, funds spent, and milestones reached in our 2025 Annual Impact Report.',
      image: 'images/program-education.jpg'
    }
  ];

  const renderNews = (host, data) => {
    const limit = Number.parseInt(host.dataset.limit || '', 10);
    const items = (Array.isArray(data) && data.length ? data : fallbackNews).slice(0, limit || undefined);
    host.innerHTML = items.map(item => `
      <article class="card news-card reveal in">
        <div class="card-media"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy"></div>
        <div class="card-body">
          <span class="card-meta">${escapeHTML(item.date)} · ${escapeHTML(item.category)}</span>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.excerpt)}</p>
          <a href="news.html" class="card-link">Read story</a>
        </div>
      </article>`).join('');
  };

  document.querySelectorAll('[data-load]').forEach(host => {
    const key = host.dataset.load;
    if (key !== 'news') return;

    // Render instantly so the page never looks blank, even on file:// previews,
    // slow hosting, or blocked JSON fetches. Replace with JSON data when available.
    renderNews(host, fallbackNews);

    fetch('data/' + key + '.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : fallbackNews)
      .then(data => renderNews(host, data))
      .catch(() => renderNews(host, fallbackNews));
  });

  /* ---------- 10. Copy donation account details ---------- */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const target = document.querySelector(btn.dataset.copy);
      if (!target) return;
      const text = target.innerText.replace(/\n{3,}/g, '\n\n').trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
      }
      const old = btn.textContent;
      btn.textContent = 'Copied ✓';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('copied'); }, 1600);
    });
  });

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* ---------- 11. Update year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

})();
