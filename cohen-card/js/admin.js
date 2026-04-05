/* ── admin.js — Admin panel with Firebase sync ── */
const ADMIN = {
  pw: localStorage.getItem('cohen_pw') || CONFIG.adminPwDefault,

  open() {
    document.getElementById('adm-ov').classList.add('open');
    document.getElementById('admPw').value = '';
    document.getElementById('admErr').style.display = 'none';
    if (sessionStorage.getItem('adm_auth') === '1') this.showMain();
    else {
      document.getElementById('adm-login-wrap').style.display = 'block';
      document.getElementById('adm-box').style.display = 'none';
      setTimeout(() => document.getElementById('admPw').focus(), 100);
    }
  },

  close() { document.getElementById('adm-ov').classList.remove('open'); },
  logout() { sessionStorage.removeItem('adm_auth'); this.close(); },

  login() {
    const pw = document.getElementById('admPw').value;
    if (pw === this.pw) {
      sessionStorage.setItem('adm_auth', '1');
      this.showMain();
    } else {
      const e = document.getElementById('admErr');
      e.style.display = 'block';
      document.getElementById('admPw').value = '';
      setTimeout(() => e.style.display = 'none', 2500);
    }
  },

  showMain() {
    document.getElementById('adm-login-wrap').style.display = 'none';
    document.getElementById('adm-box').style.display = 'block';
    this.loadFields();
    this.renderReviews();
    this.checkFirebase();
  },

  tab(id, btn) {
    document.querySelectorAll('.adm-panel').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.adm-tab').forEach(b => b.classList.remove('on'));
    document.getElementById('ap-' + id).classList.add('on');
    btn.classList.add('on');
  },

  /* Check Firebase connection */
  async checkFirebase() {
    const el = document.getElementById('fb-status');
    if (!el) return;
    try {
      await DB.get('/test');
      el.textContent = 'Firebase: מחובר ✓';
      el.style.color = '#22c55e';
    } catch(e) {
      el.textContent = 'Firebase: לא מחובר — שינויים נשמרים מקומית';
      el.style.color = '#f5a623';
    }
  },

  /* Load fields from SITE data */
  loadFields() {
    const D = CONFIG.defaults;
    const g = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

    g('ai-name',  SITE.name   || D.name);
    g('ai-role',  SITE.role   || D.role);
    g('ai-motto', SITE.motto  || D.motto);
    g('ai-quote', SITE.quote  || D.quote);
    g('ai-about', SITE.about  || D.about);
    g('ac-mob',   SITE.mob    || D.mob);
    g('ac-off',   SITE.office || D.office);
    g('ac-wa',    SITE.waNum  || D.waNum);
    g('ac-email', SITE.email  || D.email);
    g('stat1-v',  SITE.stat1v || D.stat1v);
    g('stat1-l',  SITE.stat1l || D.stat1l);
    g('stat2-v',  SITE.stat2v || D.stat2v);
    g('stat2-l',  SITE.stat2l || D.stat2l);
    g('stat3-v',  SITE.stat3v || D.stat3v);
    g('stat3-l',  SITE.stat3l || D.stat3l);

    const msgs = SITE.waMsgs || D.waMsgs;
    g('aw-gen', msgs.gen); g('aw-land', msgs.land);
    g('aw-inh', msgs.inh); g('aw-co', msgs.co);
    g('aw-not', msgs.not); g('aw-for', msgs.forr);

    // Show current images
    ['photo','avatar','logo'].forEach(key => {
      const img = DB.getImage(key, SITE);
      if (!img) return;
      const el = document.getElementById(`${key}-preview`);
      if (el) { el.src = img; el.classList.add('show'); }
    });
  },

  /* Save general info */
  async saveGeneral() {
    const gv = id => document.getElementById(id)?.value?.trim() || '';
    const updates = {
      name:   gv('ai-name'),  role:  gv('ai-role'),
      motto:  gv('ai-motto'), quote: gv('ai-quote'),
      about:  gv('ai-about'),
      mob:    gv('ac-mob'),   office: gv('ac-off'),
      waNum:  gv('ac-wa'),    email: gv('ac-email'),
      stat1v: gv('stat1-v'),  stat1l: gv('stat1-l'),
      stat2v: gv('stat2-v'),  stat2l: gv('stat2-l'),
      stat3v: gv('stat3-v'),  stat3l: gv('stat3-l'),
    };
    this.toast('שומר...');
    const ok = await DB.save('/info', updates);
    Object.assign(SITE, updates);
    applyData(SITE);
    this.toast(ok ? '✓ נשמר ב-Firebase!' : '✓ נשמר (מקומית)');
  },

  /* Save WA messages */
  async saveWA() {
    const gv = id => document.getElementById(id)?.value?.trim() || '';
    const msgs = {
      gen: gv('aw-gen'), land: gv('aw-land'),
      inh: gv('aw-inh'), co:   gv('aw-co'),
      not: gv('aw-not'), forr: gv('aw-for'),
    };
    const ok = await DB.save('/waMsgs', msgs);
    SITE.waMsgs = msgs;
    this.toast(ok ? '✓ הודעות נשמרו ב-Firebase!' : '✓ נשמר (מקומית)');
  },

  /* Image upload */
  async uploadImage(event, key) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 4) { this.toast('תמונה גדולה מדי (מקסימום 4MB)'); return; }

    this.toast('מעלה תמונה...');
    const b64 = await DB.uploadImage(file, key);

    // Update preview
    const preview = document.getElementById(`${key}-preview`);
    if (preview) { preview.src = b64; preview.classList.add('show'); }

    // Apply to page
    if (key === 'photo') {
      const hp = document.getElementById('heroPhoto');
      if (hp) hp.src = b64;
    }
    if (key === 'avatar') {
      const av = document.getElementById('avImg');
      if (av) av.src = b64;
    }
    if (key === 'logo') {
      const lg = document.getElementById('footerLogo');
      if (lg) lg.src = b64;
    }

    this.toast('✓ תמונה עודכנה!');
  },

  /* Reviews */
  renderReviews() {
    const list = document.getElementById('adm-rv-list');
    if (!list) return;
    const cache = (() => {
      try { return JSON.parse(localStorage.getItem(REVIEWS.CACHE_KEY)||'null')?.reviews || []; }
      catch(e) { return []; }
    })();
    const rvs = cache.length ? cache : CONFIG.staticReviews;

    if (!rvs.length) { list.innerHTML = '<div style="color:#6b7280;font-size:12px;padding:8px">אין ביקורות</div>'; return; }

    list.innerHTML = rvs.map((r, i) => `
      <div class="adm-rv-item">
        <div class="adm-rv-av">
          ${r.av ? `<img src="${r.av}" onerror="this.parentElement.innerHTML='${(r.name||'?')[0]}'">`
                 : (r.name||'?')[0]}
        </div>
        <div class="adm-rv-body">
          <div class="adm-rv-name">${r.name}</div>
          <div class="adm-rv-date">${r.date} · ${'★'.repeat(r.rating)}</div>
          <div class="adm-rv-text">${(r.text||'').substring(0,80)}...</div>
        </div>
        <button class="adm-rv-del" onclick="ADMIN.deleteReview(${i})">✕</button>
      </div>`).join('');
  },

  deleteReview(i) {
    const key = REVIEWS.CACHE_KEY;
    let rvs = [];
    try { rvs = JSON.parse(localStorage.getItem(key)||'null')?.reviews || [...CONFIG.staticReviews]; }
    catch(e) { rvs = [...CONFIG.staticReviews]; }
    rvs.splice(i, 1);
    localStorage.setItem(key, JSON.stringify({reviews: rvs, ts: Date.now()}));
    REVIEWS.render(rvs, document.getElementById('rvContent'));
    this.renderReviews();
    this.toast('ביקורת נמחקה');
  },

  addManualReview() {
    const name = document.getElementById('ar-name')?.value?.trim();
    const text = document.getElementById('ar-text')?.value?.trim();
    const date = document.getElementById('ar-date')?.value?.trim() || 'לאחרונה';
    if (!name || !text) { this.toast('מלא שם וטקסט'); return; }
    const key = REVIEWS.CACHE_KEY;
    let rvs = [];
    try { rvs = JSON.parse(localStorage.getItem(key)||'null')?.reviews || [...CONFIG.staticReviews]; }
    catch(e) { rvs = [...CONFIG.staticReviews]; }
    rvs.unshift({name, av:'', rating:5, date, text});
    localStorage.setItem(key, JSON.stringify({reviews: rvs, ts: Date.now()}));
    REVIEWS.render(rvs, document.getElementById('rvContent'));
    this.renderReviews();
    document.getElementById('ar-name').value = '';
    document.getElementById('ar-text').value = '';
    this.toast('✓ ביקורת נוספה!');
  },

  async refreshReviews() {
    this.toast('מרענן מגוגל...');
    const rvs = await REVIEWS.forceRefresh((reviews, isLive) => {
      REVIEWS.render(reviews, document.getElementById('rvContent'));
    });
    this.renderReviews();
    this.toast(`✓ עודכן! ${rvs?.length||0} ביקורות`);
  },

  clearReviewCache() {
    localStorage.removeItem(REVIEWS.CACHE_KEY);
    REVIEWS.render(CONFIG.staticReviews, document.getElementById('rvContent'));
    this.renderReviews();
    this.toast('Cache נוקה — יטען מחדש');
  },

  /* Password */
  changePw() {
    const cur = document.getElementById('sp-c')?.value;
    const nw  = document.getElementById('sp-n')?.value;
    const rep = document.getElementById('sp-r')?.value;
    if (cur !== this.pw)      { this.toast('סיסמה נוכחית שגויה'); return; }
    if ((nw||'').length < 4)  { this.toast('סיסמה קצרה מדי'); return; }
    if (nw !== rep)           { this.toast('הסיסמאות לא תואמות'); return; }
    this.pw = nw;
    localStorage.setItem('cohen_pw', nw);
    DB.save('/pw', nw);
    ['sp-c','sp-n','sp-r'].forEach(id => { const e = document.getElementById(id); if(e) e.value=''; });
    this.toast('✓ סיסמה עודכנה!');
  },

  toast(msg) {
    const t = document.getElementById('adm-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }
};

/* ── Event listeners ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('admPw')?.addEventListener('keydown', e => { if(e.key==='Enter') ADMIN.login(); });
  document.getElementById('adm-ov')?.addEventListener('click', e => { if(e.target===e.currentTarget) ADMIN.close(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') ADMIN.close(); });
});
