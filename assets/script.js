const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const toTop = document.getElementById('toTop');
const links = [...navLinks.querySelectorAll('a:not(.nav__cta)')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));

const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 20);
  toTop.classList.toggle('is-visible', y > 600);

  const mark = y + window.innerHeight * 0.35;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= mark) current = s; });
  if (window.innerHeight + y >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
  links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id));
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const closeMenu = () => {
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    const top = a.getAttribute('href') === '#beranda' ? 0 : target.offsetTop - nav.offsetHeight + 1;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  });
});

const tabs = document.querySelectorAll('.tab');
const dishes = document.querySelectorAll('.dish');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
    const f = tab.dataset.filter;
    dishes.forEach(d => {
      const show = f === 'all' || d.dataset.cat === f;
      d.classList.toggle('is-hidden', !show);
      d.classList.remove('is-in');
      if (show) { void d.offsetWidth; d.classList.add('is-in'); }
    });
  });
});

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
