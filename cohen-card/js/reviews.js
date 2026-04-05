/* ── reviews.js ── */
const REVIEWS = {
  CACHE_KEY: 'cohen_rv4',
  CACHE_TTL: 6 * 3600 * 1000,

  /* Hebrew date → minutes (lower = newer) */
  dateMin(d) {
    if (!d) return 9999999;
    d = d.trim();
    if (d.includes('שעתיים'))  return 120;
    if (d.includes('יומיים'))  return 2880;
    if (d.includes('שבועיים')) return 20160;
    if (d.includes('חודשיים')) return 86400;
    if (d.includes('שנתיים'))  return 1051200;
    const n = parseInt(d.match(/\d+/)?.[0] || '1');
    if (d.includes('שעות') || d.includes('שעה')) return n * 60;
    if (d.includes('ימים')  || d.includes('יום'))  return n * 1440;
    if (d.includes('שבועות')|| d.includes('שבוע')) return n * 10080;
    if (d.includes('חודשים')|| d.includes('חודש')) return n * 43200;
    if (d.includes('שנים')  || d.includes('שנה'))  return n * 525600;
    return 9999999;
  },

  sort(rv) {
    return [...rv].sort((a, b) => this.dateMin(a.date) - this.dateMin(b.date));
  },

  /* Fetch one page from SerpAPI via proxy */
  async fetchPage(token) {
    const p = new URLSearchParams({
      engine: 'google_maps_reviews',
      data_id: CONFIG.serpDid,
      hl: 'iw',
      api_key: CONFIG.serpKey
    });
    if (token) p.set('next_page_token', token);
    const url = 'https://serpapi.com/search.json?' + p;
    const res = await fetch(CONFIG.proxy + encodeURIComponent(url));
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  },

  /* Fetch all pages (pagination) */
  async fetchAll() {
    let all = [], token = null, page = 0;
    while (page < 5) {
      const d = await this.fetchPage(token);
      const rv = d.reviews || [];
      if (!rv.length) break;
      all = all.concat(rv.map(r => ({
        name: r.user?.name || '',
        av:   r.user?.thumbnail || '',
        rating: r.rating || 5,
        date: r.date || '',
        text: (r.snippet || '').replace(/\n/g, ' ')
      })));
      page++;
      token = d.serpapi_pagination?.next_page_token;
      if (!token) break;
    }
    return all;
  },

  /* Main load — cache first (instant) → Firebase always in bg */
  async load(onReady) {
    // 1. localStorage cache — show immediately (instant UX)
    let cachedCount = 0;
    try {
      const c = JSON.parse(localStorage.getItem(this.CACHE_KEY) || 'null');
      if (c?.reviews?.length) {
        onReady(this.sort(c.reviews));
        cachedCount = c.reviews.length;
      }
    } catch(e) {}

    // 2. ALWAYS fetch from Firebase — may have newer reviews
    try {
      const fbRv = await DB.get('/site/reviews');
      if (Array.isArray(fbRv) && fbRv.length > 0) {
        // Update cache and re-render only if data changed
        const localKey = JSON.stringify(fbRv.map(r=>r.name+r.date).sort());
        const cacheKey = localStorage.getItem(this.CACHE_KEY+'_hash');
        if (localKey !== cacheKey || fbRv.length !== cachedCount) {
          localStorage.setItem(this.CACHE_KEY, JSON.stringify({reviews: fbRv, ts: Date.now()}));
          localStorage.setItem(this.CACHE_KEY+'_hash', localKey);
          onReady(this.sort(fbRv));
        }
        return;
      }
    } catch(e) { console.warn('FB reviews:', e.message); }

    // 3. No cache and no Firebase — show static fallback + fetch live
    if (!cachedCount) {
      onReady(this.sort(CONFIG.staticReviews || []));
    }
    this._refresh(onReady);
  },

  async _refresh(onReady) {
    try {
      const rv = await this.fetchAll();
      if (rv.length > 0) {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify({reviews: rv, ts: Date.now()}));
        try { await DB.set('/site/reviews', rv); } catch(e) {}
        onReady(this.sort(rv));
      }
    } catch(e) { console.warn('SerpAPI:', e.message); }
  },

  async forceRefresh(onReady) {
    localStorage.removeItem(this.CACHE_KEY);
    return this._refresh(onReady || (() => {}));
  },

  /* Render to DOM — 5 first + show more */
  render(reviews, el) {
    if (!el) return;
    if (!reviews?.length) {
      el.innerHTML = '<div style="padding:24px;text-align:center;color:#888;font-size:13px">אין ביקורות</div>';
      return;
    }

    const star = (n, size) => Array.from({length:5}, (_, i) =>
      `<svg viewBox="0 0 24 24" style="width:${size}px;height:${size}px;display:inline-block">
        <path fill="${i<n?'#f5c518':'#dde0e6'}" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>`).join('');

    const gLogo = `<svg width="13" height="13" viewBox="0 0 48 48" style="vertical-align:middle;margin-left:3px">
      <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.3 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" fill="#FFC107"/>
      <path d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.3 6.5 29.4 4 24 4 16.3 4 9.7 8.5 6.3 14.7z" fill="#FF3D00"/>
      <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.3C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.4C9.7 35.5 16.3 44 24 44z" fill="#4CAF50"/>
      <path d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.7-4.6 6.2l6.2 5.3C41.5 36.3 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#1976D2"/>
    </svg>`;

    const card = r => {
      const init = (r.name || '?')[0].toUpperCase();
      const hasAv = r.av && r.av.length > 10;
      return `
      <div class="rv-item">
        <div class="rv-top">
          <div class="rv-av">
            ${hasAv
              ? `<img src="${r.av}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" onerror="this.parentElement.textContent='${init}'">`
              : init}
          </div>
          <div>
            <div class="rv-nm">${r.name}</div>
            <div class="rv-dt">${r.date}</div>
          </div>
        </div>
        <div class="rv-s">${star(r.rating, 12)}</div>
        <div class="rv-txt">${r.text}</div>
      </div>`;
    };

    const SHOW = 5;
    const rest = reviews.length - SHOW;

    let html = `
      <div class="rv-header">
        <div>
          <div class="rv-score">5.0</div>
          <div class="rv-stars-row">${star(5, 14)}</div>
          <div class="rv-cnt">${reviews.length} ביקורות</div>
          <div class="rv-g-tag">${gLogo} Google Reviews</div>
        </div>
      </div>
      ${reviews.slice(0, SHOW).map(card).join('')}`;

    if (rest > 0) {
      html += `
      <div id="rv-extra" style="display:none">
        ${reviews.slice(SHOW).map(card).join('')}
      </div>
      <div style="text-align:center;padding:14px 0;border-top:1px solid var(--line)">
        <button id="rv-more-btn"
          onclick="var x=document.getElementById('rv-extra'),o=x.style.display==='none';x.style.display=o?'block':'none';this.textContent=o?'הצג פחות ▲':'הצג עוד ${rest} ביקורות ▼'"
          style="background:none;border:1.5px solid var(--cyan);color:var(--blue);border-radius:20px;padding:8px 22px;font-family:'Heebo',sans-serif;font-size:12px;font-weight:700;cursor:pointer">
          הצג עוד ${rest} ביקורות ▼
        </button>
      </div>`;
    }

    html += `<a href="https://g.page/r/CcV7iZaPbmfOEBM/review" target="_blank" class="rv-add">
      ${gLogo} כתוב ביקורת בגוגל
    </a>`;

    el.innerHTML = html;
  }
};
