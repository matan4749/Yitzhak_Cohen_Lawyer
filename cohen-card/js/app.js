/* ── app.js — main application logic ── */

/* ══ PARALLAX ══ */
const PARALLAX = {
  enabled: true,
  init() {
    window.addEventListener('scroll', () => this.update(), {passive: true});
    this.update();
  },
  update() {
    const sy = window.scrollY;
    // progress bar
    const prog = document.getElementById('prog');
    if (prog) prog.style.height = Math.min(sy / (document.body.scrollHeight - window.innerHeight) * 100, 100) + '%';
    if (!this.enabled) return;
    // hero
    const hp = document.getElementById('heroPx');
    if (hp) hp.style.transform = `translateY(${sy * 0.42}px)`;
    // parallax dividers
    document.querySelectorAll('.pd').forEach(div => {
      const rect = div.getBoundingClientRect();
      const bg = div.querySelector('.pd-bg');
      if (bg) bg.style.transform = `translateY(${rect.top * 0.32}px)`;
    });
  },
  toggle(on) {
    this.enabled = on;
    if (!on) {
      const hp = document.getElementById('heroPx');
      if (hp) hp.style.transform = '';
      document.querySelectorAll('.pd-bg').forEach(b => b.style.transform = '');
    }
  }
};

/* ══ PARTICLES ══ */
(function spawnParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = 2 + Math.random() * 5;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${10+Math.random()*80}%;bottom:${Math.random()*50}%;animation-duration:${3+Math.random()*5}s;animation-delay:${Math.random()*5}s;`;
    c.appendChild(p);
  }
})();

/* ══ SCROLL REVEAL ══ */
const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      const d = parseInt(e.target.dataset.d || 0);
      setTimeout(() => e.target.classList.add('vis'), d);
      io.unobserve(e.target);
    }
  });
}, {threshold: .06, rootMargin: '0px 0px -30px 0px'});
document.querySelectorAll('.sec').forEach(s => io.observe(s));

/* ══ SERVICES ACCORDION ══ */
function tSvc(h) {
  const b = h.nextElementSibling;
  const open = h.classList.contains('open');
  document.querySelectorAll('.sv-h').forEach(x => {
    x.classList.remove('open');
    x.nextElementSibling.classList.remove('open');
  });
  if (!open) { h.classList.add('open'); b.classList.add('open'); }
}

/* ══ WA MESSAGES ══ */
const WA_MSGS = Object.assign({}, CONFIG.defaults.waMsgs);

function openWA(svc) {
  const num = SITE.waNum || CONFIG.defaults.waNum;
  const msgs = SITE.waMsgs || WA_MSGS;
  const k = {כללי:'gen', מקרקעין:'land', ירושה:'inh', חברות:'co', נוטריון:'not', 'תושבי חוץ':'forr'};
  const msg = msgs[k[svc]] || WA_MSGS.gen;
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
}
function openWaze() { window.open('https://waze.com/ul?q=הכישור+47+חולון&navigate=yes', '_blank'); }
function shareMe() {
  if (navigator.share) {
    navigator.share({title: 'עו"ד יצחק כהן', text: 'עורך דין ונוטריון', url: location.href});
  } else {
    navigator.clipboard?.writeText(location.href);
    showToast('הקישור הועתק');
  }
}
function addContact() {
  const name = SITE.name || CONFIG.defaults.name;
  const mob  = SITE.mob  || CONFIG.defaults.mob;
  const off  = SITE.office || CONFIG.defaults.office;
  const mail = SITE.email || CONFIG.defaults.email;
  const v = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:משרד עורכי דין ונוטריון כהן יצחק\nTITLE:עורך דין ונוטריון\nTEL;TYPE=CELL:${mob}\nTEL;TYPE=WORK:${off}\nEMAIL:${mail}\nADR;TYPE=WORK:;;רחוב הכישור 47;חולון;;;ישראל\nEND:VCARD`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([v], {type:'text/vcard'}));
  a.download = 'itzik-cohen.vcf';
  a.click();
  showToast('הורד — פתח להוספה לאנשי קשר');
}
function sendForm() {
  const n = document.getElementById('fn')?.value?.trim();
  const p = document.getElementById('fp')?.value?.trim();
  const t = document.getElementById('ft')?.value;
  const m = document.getElementById('fm')?.value?.trim();
  if (!n) { showToast('אנא הכנס שם'); return; }
  if (!p) { showToast('אנא הכנס טלפון'); return; }
  const msg = `פנייה מהאתר\n\nשם: ${n}\nטלפון: ${p}${t?'\nנושא: '+t:''}${m?'\nהודעה: '+m:''}`;
  const num = SITE.waNum || CONFIG.defaults.waNum;
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('הפנייה נשלחת...');
}

/* ══ TOAST ══ */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(() => t.classList.remove('on'), 2800);
}

/* ══ APPLY SITE DATA TO DOM ══ */
let SITE = {};

function applyData(data) {
  SITE = data || {};
  const D = CONFIG.defaults;
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

  set('heroName',  SITE.name   || D.name);
  set('heroRole',  SITE.role   || D.role);
  set('heroMotto', SITE.motto  || D.motto);
  set('heroQuote', '"' + (SITE.quote || D.quote) + '"');
  set('heroAbout', SITE.about  || D.about);
  set('footerName',SITE.name   || D.name);
  set('stat1',     SITE.stat1v || D.stat1v);
  set('stat1l',    SITE.stat1l || D.stat1l);
  set('stat2',     SITE.stat2v || D.stat2v);
  set('stat2l',    SITE.stat2l || D.stat2l);
  set('stat3',     SITE.stat3v || D.stat3v);
  set('stat3l',    SITE.stat3l || D.stat3l);

  // phone/email links
  const mob  = SITE.mob    || D.mob;
  const off  = SITE.office || D.office;
  const mail = SITE.email  || D.email;
  document.querySelectorAll('a[href^="tel:052"]').forEach(a => a.href = 'tel:' + mob);
  document.querySelectorAll('a[href^="tel:035"]').forEach(a => a.href = 'tel:' + off);
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.href = 'mailto:' + mail);

  // images — each one only updates if it has its own saved value
  const heroImgSrc = DB.getImage('photo', SITE);
  const avatarSrc  = DB.getImage('avatar', SITE);
  const logoSrc    = DB.getImage('logo', SITE);

  // Only apply each image to its own element, never cross-apply
  const heroEl   = document.getElementById('heroPhoto');
  const avEl     = document.getElementById('avImg');
  const logoEl   = document.getElementById('footerLogo');
  const faviconEl= document.getElementById('favicon');

  if (heroImgSrc && heroEl)    heroEl.src    = heroImgSrc;
  else if (!heroImgSrc && heroEl && heroEl.src === '') heroEl.src = D.photo;

  if (avatarSrc && avEl)       avEl.src      = avatarSrc;
  else if (!avatarSrc && avEl && avEl.src === '') avEl.src = D.photo;

  if (logoSrc && logoEl)       logoEl.src    = logoSrc;
  else if (!logoSrc && logoEl && logoEl.src === '') logoEl.src = D.photo;

  if (logoSrc && faviconEl)    faviconEl.href = logoSrc;
  else if (heroImgSrc && faviconEl) faviconEl.href = heroImgSrc;
}

/* ══ INIT ══ */
(async function init() {
  // Start parallax
  PARALLAX.init();

  // Load site data from Firebase
  const data = await DB.load();
  applyData(data);

  // Load reviews
  REVIEWS.load((reviews, isLive) => {
    const el = document.getElementById('rvContent');
    REVIEWS.render(reviews, el);
    if (!isLive) {
      // Show loading indicator while fetching
      const indicator = document.createElement('div');
      indicator.style.cssText = 'text-align:center;padding:6px;font-size:10px;color:#8090b0;border-top:1px solid var(--line)';
      indicator.textContent = 'מעדכן ביקורות...';
      indicator.id = 'rv-loading';
      el.appendChild(indicator);
    } else {
      // Remove loading indicator when live data arrives
      document.getElementById('rv-loading')?.remove();
    }
  });
})();
