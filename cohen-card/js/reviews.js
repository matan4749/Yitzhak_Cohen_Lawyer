/* ── reviews.js — SerpAPI + CORS proxy + pagination ── */
const REVIEWS = {
  CACHE_KEY: 'cohen_reviews_v3',
  CACHE_TTL: 6 * 3600 * 1000,

  /* Convert Hebrew relative date to minutes (lower = newer) */
  dateToMin(d) {
    if (!d) return 999999999;
    d = d.trim();
    if ('שעתיים'  in d || d.includes('שעתיים'))  return 120;
    if (d.includes('יומיים'))   return 2880;
    if (d.includes('שבועיים'))  return 20160;
    if (d.includes('חודשיים'))  return 86400;
    if (d.includes('שנתיים'))   return 1051200;
    if (d.includes('שעה') && !d.match(/\d/)) return 60;
    if (d.includes('יום')  && !d.match(/\d/)) return 1440;
    if (d.includes('שבוע') && !d.match(/\d/)) return 10080;
    if (d.includes('חודש') && !d.match(/\d/)) return 43200;
    if (d.includes('שנה')  && !d.match(/\d/)) return 525600;
    const n = parseInt(d.match(/\d+/)?.[0] || '1');
    if (d.includes('שעות') || d.includes('שעה')) return n * 60;
    if (d.includes('ימים') || d.includes('יום'))  return n * 1440;
    if (d.includes('שבועות') || d.includes('שבוע')) return n * 10080;
    if (d.includes('חודשים') || d.includes('חודש')) return n * 43200;
    if (d.includes('שנים') || d.includes('שנה'))   return n * 525600;
    return 999999999;
  },

  /* Sort reviews newest first */
  sortByDate(reviews) {
    return [...reviews].sort((a, b) => this.dateToMin(a.date) - this.dateToMin(b.date));
  },

  async fetchPage(token) {
    const p = new URLSearchParams({
      engine: 'google_maps_reviews',
      data_id: CONFIG.serpDid,
      hl: 'iw',
      api_key: CONFIG.serpKey
    });
    if (token) p.set('next_page_token', token);
    const url = `https://serpapi.com/search.json?${p}`;
    const res = await fetch(CONFIG.proxy + encodeURIComponent(url));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async fetchAll() {
    let all = [], token = null, page = 0;
    while (page < 5) {
      const d = await this.fetchPage(token);
      if (d.error) throw new Error(d.error);
      const rv = d.reviews || [];
      if (!rv.length) break;
      all = all.concat(rv.map(r => ({
        name:   r.user?.name   || '',
        av:     r.user?.thumbnail || '',
        rating: r.rating       || 5,
        date:   r.date         || '',
        text:   (r.snippet||'').replace(/\n/g,' ')
      })));
      page++;
      token = d.serpapi_pagination?.next_page_token;
      if (!token) break;
    }
    return all;
  },

  async load(onReady) {
    // 1. Show localStorage cache immediately (fastest)
    try {
      const c = JSON.parse(localStorage.getItem(this.CACHE_KEY)||'null');
      if (c?.reviews?.length) {
        onReady(c.reviews, false);
        if (Date.now() - c.ts < this.CACHE_TTL) return c.reviews;
      }
    } catch(e) {}

    // 2. Try Firebase (saved reviews from last full fetch)
    try {
      const fbReviews = await DB.get('/site/reviews');
      if (Array.isArray(fbReviews) && fbReviews.length > 0) {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify({reviews:fbReviews, ts:Date.now()}));
        onReady(fbReviews, true);
        // Refresh from SerpAPI in background if >6h
        const cached = JSON.parse(localStorage.getItem(this.CACHE_KEY)||'{}');
        if (!cached.ts || Date.now() - cached.ts > this.CACHE_TTL) {
          this.fetchAndSave(onReady);
        }
        return fbReviews;
      }
    } catch(e) {
      console.warn('Firebase reviews load failed:', e.message);
    }

    // 3. Show static fallback while SerpAPI fetches
    const fallback = CONFIG.staticReviews || [];
    if (fallback.length) onReady(fallback, false);

    // 4. Fetch live from SerpAPI
    return this.fetchAndSave(onReady);
  },

  async fetchAndSave(onReady) {
    try {
      const reviews = await this.fetchAll();
      if (reviews.length > 0) {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify({reviews, ts:Date.now()}));
        // Save to Firebase for persistence
        try { await DB.set('/site/reviews', reviews); } catch(e) {}
        onReady(reviews, true);
        return reviews;
      }
    } catch(e) {
      console.warn('SerpAPI fetch failed:', e.message);
    }
    return CONFIG.staticReviews || [];
  },

  async forceRefresh(onReady) {
    localStorage.removeItem(this.CACHE_KEY);
    return this.fetchAndSave(onReady || (() => {}));
  },

  render(reviews, el) {
    if (!el) return;
    if (!reviews?.length) { el.innerHTML = '<div style="padding:20px;text-align:center;color:#888">אין ביקורות</div>'; return; }

    // Sort newest first
    const sorted = this.sortByDate(reviews);

    const stars = (n, size=12) => Array.from({length:5},(_,i) =>
      `<svg viewBox="0 0 24 24" style="width:${size}px;height:${size}px;display:inline-block">
        <path fill="${i<n?'#f5c518':'#dde0e6'}" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>`).join('');

    const gLogo = `<svg width="14" height="14" viewBox="0 0 48 48" style="vertical-align:middle;margin-left:4px">
      <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.3 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" fill="#FFC107"/>
      <path d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.3 6.5 29.4 4 24 4 16.3 4 9.7 8.5 6.3 14.7z" fill="#FF3D00"/>
      <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.3C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.4C9.7 35.5 16.3 44 24 44z" fill="#4CAF50"/>
      <path d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.7-4.6 6.2l6.2 5.3C41.5 36.3 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#1976D2"/>
    </svg>`;

    const INITIAL = 5;
    const total = sorted.length;

    const buildItem = r => {
      const init = (r.name||'?')[0].toUpperCase();
      const hasPhoto = r.av && r.av.length > 10;
      return `
        <div class="rv-item">
          <div class="rv-top">
            <div class="rv-av">${hasPhoto
              ? `<img src="${r.av}" alt=""
                     style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
              : ''}
              <span style="display:${hasPhoto?'none':'flex'};width:100%;height:100%;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:white;border-radius:50%;background:var(--navy2)">${init}</span>
            </div>
            <div>
              <div class="rv-nm">${r.name}</div>
              <div class="rv-dt">${r.date}</div>
            </div>
          </div>
          <div class="rv-s">${stars(r.rating,12)}</div>
          <div class="rv-txt">${r.text}</div>
        </div>`;
    };

    let html = `
      <div class="rv-header">
        <div>
          <div class="rv-score">5.0</div>
          <div class="rv-stars-row">${stars(5,14)}</div>
          <div class="rv-cnt">${total} ביקורות</div>
          <div class="rv-g-tag">${gLogo} Google Reviews</div>
        </div>
      </div>`;

    // First 5 (newest)
    sorted.slice(0, INITIAL).forEach(r => { html += buildItem(r); });

    // Remaining hidden
    if (total > INITIAL) {
      const remaining = total - INITIAL;
      html += `<div id="rv-extra" style="display:none">`;
      sorted.slice(INITIAL).forEach(r => { html += buildItem(r); });
      html += `</div>
        <div style="text-align:center;padding:14px 0;border-top:1px solid var(--line);">
          <button onclick="
            var e=document.getElementById('rv-extra');
            var open=e.style.display!=='none';
            e.style.display=open?'none':'block';
            this.textContent=open?'הצג עוד ${remaining} ביקורות ▼':'הצג פחות ▲';
          " style="background:none;border:1.5px solid var(--cyan);color:var(--blue);
            border-radius:20px;padding:8px 22px;font-family:'Heebo',sans-serif;
            font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;
            -webkit-tap-highlight-color:transparent">
            הצג עוד ${remaining} ביקורות ▼
          </button>
        </div>`;
    }

    html += `<a href="https://search.google.com/local/writereview?placeid=ChIJWZUs8WfSeAYRUhyJlo9uZ84"
       target="_blank" class="rv-add">${gLogo} כתוב ביקורת בגוגל</a>`;

    el.innerHTML = html;
  }
};
