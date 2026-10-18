(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Scroll: navbar shadow, progress bar, back-to-top
  const nav = $('#nav'), bar = $('#bar'), topBtn = $('#toTop');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', scrollY > 20);
    bar.style.width = (scrollY / max * 100) + '%';
    topBtn.classList.toggle('show', scrollY > 500);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  topBtn.onclick = () => scrollTo({ top: 0 });

  // Close promo bar
  $('#promoClose').onclick = () => $('#promo').remove();

  // Typing effect
  const words = ['online.', 'dari para ahli.', 'kapan saja.', 'dengan sertifikat.'];
  let w = 0, c = 0, del = false; const t = $('#typed');
  (function type() {
    const word = words[w]; t.textContent = word.slice(0, c);
    if (!del && c++ === word.length) { del = true; return setTimeout(type, 1500); }
    if (del && --c < 0) { del = false; c = 0; w = (w + 1) % words.length; }
    setTimeout(type, del ? 40 : 90);
  })();

  // Hero search: click tags to fill, Enter/button jumps to courses
  $$('.tags span').forEach(s => s.onclick = () => { $('#q').value = s.textContent; $('#q').focus(); });
  const go = () => {
    const v = $('#q').value.trim().toLowerCase();
    $$('.chip').forEach(b => b.classList.remove('active')); $('.chip[data-f="all"]').classList.add('active');
    $$('.course-col').forEach(col => col.classList.toggle('hide', v && !col.textContent.toLowerCase().includes(v)));
    $('#courses').scrollIntoView({ behavior: 'smooth' });
  };
  $('#qBtn').onclick = go; $('#q').addEventListener('keydown', e => e.key === 'Enter' && go());

  // Hero parallax tilt
  const vis = $('#heroVis');
  vis.parentElement.addEventListener('mousemove', e => {
    const r = vis.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    vis.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  vis.parentElement.addEventListener('mouseleave', () => vis.style.transform = '');

  // Reveal on scroll (staggered)
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.reveal').forEach((n, i) => { n.style.transitionDelay = (i % 4) * .1 + 's'; io.observe(n); });
  setTimeout(() => $$('.reveal').forEach(n => n.classList.add('in')), 3000); // safety net

  // Counters
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const n = e.target, to = +n.dataset.count, suf = n.dataset.suffix || '', t0 = performance.now();
    const step = ts => {
      const p = Math.min((ts - t0) / 1600, 1), v = Math.floor(to * (1 - Math.pow(1 - p, 3)));
      n.textContent = v.toLocaleString('en-US') + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step); cio.unobserve(n);
  }));
  $$('[data-count]').forEach(n => cio.observe(n));

  // 3D tilt on course cards
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // Magnetic buttons
  $$('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });

  // Course filter
  $$('.chip').forEach(btn => btn.onclick = () => {
    $$('.chip').forEach(b => b.classList.remove('active')); btn.classList.add('active');
    const f = btn.dataset.f;
    $$('.course-col').forEach(col => col.classList.toggle('hide', f !== 'all' && col.dataset.cat !== f));
  });

  // Newsletter
  $('#subForm').addEventListener('submit', e => {
    e.preventDefault(); const m = $('#subMsg'); m.textContent = 'Terima kasih! Kode diskon 20% dikirim ke email Anda.'; m.className = 'toast-msg'; e.target.reset();
  });
})();
