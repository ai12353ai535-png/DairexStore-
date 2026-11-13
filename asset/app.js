(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const searchPanel = document.querySelector('.search-panel');
  const searchInput = document.querySelector('#siteSearch');

  const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }));
  }

  document.querySelectorAll('.search-toggle').forEach(button => button.addEventListener('click', () => {
    if (!searchPanel) return;
    searchPanel.classList.add('visible');
    searchPanel.setAttribute('aria-hidden', 'false');
    setTimeout(() => searchInput?.focus(), 80);
  }));
  document.querySelector('.search-close')?.addEventListener('click', () => {
    searchPanel?.classList.remove('visible');
    searchPanel?.setAttribute('aria-hidden', 'true');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      searchPanel?.classList.remove('visible');
      searchPanel?.setAttribute('aria-hidden', 'true');
      nav?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const chips = [...document.querySelectorAll('.category-chip')];
  const cards = [...document.querySelectorAll('.product-card')];
  const noResults = document.querySelector('.no-results');
  let currentFilter = new URLSearchParams(location.search).get('category') || 'all';
  const applyFilters = () => {
    const term = (searchInput?.value || '').trim().toLocaleLowerCase('fa');
    let shown = 0;
    cards.forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      const matchesCategory = currentFilter === 'all' || categories.includes(currentFilter);
      const matchesText = !term || (card.dataset.name + ' ' + card.textContent).toLocaleLowerCase('fa').includes(term);
      const visible = matchesCategory && matchesText;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (noResults) noResults.hidden = shown !== 0;
    chips.forEach(chip => chip.classList.toggle('active', chip.dataset.filter === currentFilter));
  };
  chips.forEach(chip => chip.addEventListener('click', () => {
    currentFilter = chip.dataset.filter;
    applyFilters();
    document.querySelector('#productGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  searchInput?.addEventListener('input', applyFilters);
  if (cards.length) applyFilters();

  const form = document.querySelector('#contactForm');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const message = String(data.get('message') || '').trim();
    const output = document.querySelector('.form-feedback');
    if (!name || !phone || !message) {
      if (output) output.textContent = 'لطفاً همه فیلدها را کامل کن.';
      return;
    }
    const text = `سلام، من ${name} هستم.\nشماره تماس: ${phone}\nپیام: ${message}`;
    if (output) output.textContent = 'پیامت آماده شد. برای ارسال واقعی، دکمه تلگرام را انتخاب کن و متن را در گفت‌وگو وارد کن.';
    const telegram = document.createElement('a');
    telegram.href = `https://t.me/DayrexSrtorebot?start=${encodeURIComponent(text)}`;
    telegram.target = '_blank';
    telegram.rel = 'noopener';
    telegram.className = 'text-link form-telegram-link';
    telegram.textContent = 'رفتن به تلگرام ↗';
    output?.appendChild(document.createTextNode(' '));
    output?.appendChild(telegram);
  });
})();