/* ── Theme ──────────────────────────────────────────── */
const ICONS = { light: '🌙', dark: '☀️' };

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  const icon = ICONS[theme] ?? '🌙';
  const btn  = document.getElementById('themeBtn');
  const btnD = document.getElementById('themeBtnD');
  if (btn)  { btn.textContent  = icon; btn.setAttribute('aria-label',  theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
  if (btnD) { btnD.textContent = icon; }
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ── Language toggle ────────────────────────────────── */
function setLang(l) {
  document.documentElement.lang = l;
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('vis', el.dataset.lang === l);
  });
  ['nl-en','nl-fr','dl-en','dl-fr','nt-en','nt-fr'].forEach(cls => {
    const lang = cls.slice(-2);
    document.querySelectorAll('.' + cls).forEach(el => {
      el.style.display = (lang === l) ? '' : 'none';
    });
  });
  document.getElementById('enBtn').classList.toggle('active', l === 'en');
  document.getElementById('frBtn').classList.toggle('active', l === 'fr');
  const enD = document.getElementById('enBtnD');
  const frD = document.getElementById('frBtnD');
  if (enD) enD.classList.toggle('active', l === 'en');
  if (frD) frD.classList.toggle('active', l === 'fr');
  localStorage.setItem('lang', l);
}

/* ── Burger / drawer ────────────────────────────────── */
const burger = document.getElementById('navBurger');
const drawer = document.getElementById('navDrawer');

function closeDrawer() {
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

burger.addEventListener('click', () => {
  const isOpen = drawer.classList.contains('open');
  if (isOpen) { closeDrawer(); }
  else {
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  }
});

document.getElementById('themeBtn').addEventListener('click', toggleTheme);
document.getElementById('themeBtnD').addEventListener('click', () => { toggleTheme(); });

document.addEventListener('click', e => {
  if (!document.getElementById('mainNav').contains(e.target)) closeDrawer();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* ── Init ────────────────────────────────────────────── */
// Theme: default light, respect saved preference
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// Language: default en
const savedLang = localStorage.getItem('lang') || 'en';
setLang(savedLang);

/* ── Identity obfuscation ───────────────────────────────
   All PII decoded only after page load + delay.
   Static source contains zero plaintext names or URLs.
   ───────────────────────────────────────────────────── */
window.addEventListener('load', function () {
  setTimeout(function () {

    /* ── Decode ── */
    const fn       = atob('R2hhc3NhbmU=');
    const ln       = atob('QmluYWhsYQ==');
    const navN     = atob('Ry4gQmluYWhsYQ==');
    const calendly = atob('aHR0cHM6Ly9jYWxlbmRseS5jb20vZ2hhc3NhbmUtYmluYWhsYS9zY2hlZHVsZS1tZWV0aW5n');
    const linkedin = atob('aHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vZ2hhc3NhbmUtYmluYWhsYQ==');
    const display  = atob('Z2JpbmFobGEucHJvQGdtYWlsLmNvbQ==');
    const mailto   = atob('Z2JpbmFobGEucHJvK2Jpb0BnbWFpbC5jb20=');

    /* ── <title> ── */
    document.title = fn + ' ' + ln + ' — AI-Powered Software Engineer';

    /* ── Nav brand ── */
    const navName = document.getElementById('navName');
    if (navName) navName.textContent = navN;

    /* ── Hero h1 ── */
    const heroName = document.getElementById('heroName');
    if (heroName) heroName.innerHTML = fn + '<br /><em>' + ln + '</em>';

    /* ── Calendly links ── */
    ['calLink1', 'calLink2'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.href = calendly;
    });

    /* ── LinkedIn links ── */
    ['liLink1', 'liLink2'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.href = linkedin;
    });

    /* ── Email badge ── */
    const badge = document.getElementById('emailBadge');
    if (badge) {
      badge.src = 'https://img.shields.io/badge/email-'
        + encodeURIComponent(display)
        + '-blue?style=flat-square&logo=gmail';
    }
    const mailLink = document.getElementById('mailLink');
    if (mailLink) mailLink.href = 'mailto:' + mailto;

    /* ── Footer ── */
    const footer = document.getElementById('footerContact');
    if (footer) {
      footer.innerHTML = fn + ' ' + ln
        + ' · Paris, France · <a href="mailto:' + mailto + '">' + display + '</a>';
    }

  }, 2500); // 2.5 s post-load — crawlers never reach this
});
