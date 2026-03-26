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

// Language: respect saved preference; otherwise detect from browser/OS
const _saved = localStorage.getItem('lang');
const _browserLang = (navigator.languages && navigator.languages.length)
  ? navigator.languages[0]
  : navigator.language || 'en';
const savedLang = _saved || (_browserLang.toLowerCase().startsWith('fr') ? 'fr' : 'en');
setLang(savedLang);

/* ── Identity obfuscation ───────────────────────────────
   Three layers:
   1. XOR rotation — 9-byte cycling key; raw base64 is meaningless without it.
   2. Fragment splitting — each secret split into 3 parts, scattered below.
   3. Interaction-triggered URLs — Calendly & LinkedIn only decoded on
      mouseover/touchstart; headless crawlers without interaction never see them.
   ───────────────────────────────────────────────────── */

// XOR key — 9 bytes, cycles over each character of the decoded base64
const _k = [42, 79, 28, 115, 178, 53, 105, 88, 31];

function _xd(parts) {
  const raw = atob(parts.join(''));
  return raw.split('').map(function (c, i) {
    return String.fromCharCode(c.charCodeAt(0) ^ _k[i % _k.length]);
  }).join('');
}

// — first-name fragments (fn = "Ghassane")
const _f0 = 'bSd9'; const _f2 = 'Bz0=';
// — last-name fragments (ln = "Binahla")
const _f3 = 'aCZy'; const _f5 = 'CA==';
// — nav brand fragments (navN = "G. Binahla")
const _f6 = 'bWE8Md'; const _f8 = 'Sw==';
// — display email fragments
const _f9 = 'TS11HdNdBTk'; const _fB = 'FzBCxzHg==';
// — mailto fragments
const _fC = 'TS11HdNdBTkx'; const _fE = 'Ry51H5xWBjU=';

// Middle fragments interleaved to break sequential regex scans
const _f1 = 'AMFU'; const _f4 = 'EtpZ'; const _f7 = 'tbCDBz';
const _fA = 'xWj1zM9VYCD'; const _fD = 'Wj1zWNBcBhh4';

// — calendly URL fragments (interaction-only, see below)
const _fF = 'QjtoA8EPRnd8SyN5HdZZEHZ8';
const _fG = 'RSIzFNpUGit+RCoxEdtbCDBz';
const _fH = 'S2BvENpQDS1zT2JxFtdBADZ4';

// — linkedin URL fragments (interaction-only, see below)
const _fI = 'QjtoA8EPRndzQyF3FtZ';
const _fJ = 'cB3Z8RSIzGtwaDjB+WT';
const _fK = 'x9HdcYCzFxSydwEg==';

/* ── Static PII: injected 2.5 s after load ── */
window.addEventListener('load', function () {
  setTimeout(function () {

    const fn      = _xd([_f0, _f1, _f2]);
    const ln      = _xd([_f3, _f4, _f5]);
    const navN    = _xd([_f6, _f7, _f8]);
    const display = _xd([_f9, _fA, _fB]);
    const mailto  = _xd([_fC, _fD, _fE]);

    /* ── <title> ── */
    document.title = fn + ' ' + ln + ' — AI-Powered Software Engineer';

    /* ── Nav brand ── */
    const navName = document.getElementById('navName');
    if (navName) navName.textContent = navN;

    /* ── Hero h1 ── */
    const heroName = document.getElementById('heroName');
    if (heroName) heroName.innerHTML = fn + '<br /><em>' + ln + '</em>';

    /* ── Email links ── */
    ['mailLink', 'mailLink1'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = 'mailto:' + mailto;
    });

    /* ── Footer ── */
    const footer = document.getElementById('footerContact');
    if (footer) {
      footer.innerHTML = fn + ' ' + ln
        + ' · Paris, France · <a href="mailto:' + mailto + '">' + display + '</a>';
    }

  }, 2500); // 2.5 s post-load — crawlers never reach this
});

/* ── Interaction-triggered URL decode ───────────────────
   Calendly and LinkedIn hrefs are only set on first mouseover
   or touchstart — a headless browser with no interaction never
   sees the real URL, even after the page fully loads.
   ───────────────────────────────────────────────────── */
(function () {
  var _calDone = false;
  var _liDone  = false;

  function _revealCal() {
    if (_calDone) return;
    _calDone = true;
    var url = _xd([_fF, _fG, _fH]);
    ['calLink1', 'calLink2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = url;
    });
  }

  function _revealLi() {
    if (_liDone) return;
    _liDone = true;
    var url = _xd([_fI, _fJ, _fK]);
    ['liLink1', 'liLink2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = url;
    });
  }

  ['calLink1', 'calLink2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('mouseover',  _revealCal);
      el.addEventListener('touchstart', _revealCal);
    }
  });

  ['liLink1', 'liLink2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('mouseover',  _revealLi);
      el.addEventListener('touchstart', _revealLi);
    }
  });
}());

/* ── Skills tab filter ──────────────────────────────── */
(function () {
  const tabs  = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-icon-card');
  if (!tabs.length) return;

  function activate(tab) {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const active = tab.dataset.tab;
    cards.forEach(card => {
      card.hidden = card.dataset.tab !== active;
    });
  }

  tabs.forEach(tab => tab.addEventListener('click', () => activate(tab)));

  // Init: show first tab's cards
  activate(tabs[0]);
}());
