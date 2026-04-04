/* ── db.js — Firebase Realtime Database ── */
const DB = {
  base: CONFIG.firebase,

  async get(path) {
    const r = await fetch(`${this.base}${path}.json`, {cache:'no-store'});
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  async set(path, value) {
    const r = await fetch(`${this.base}${path}.json`, {
      method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(value)
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  async load() {
    try {
      const data = await this.get('/site');
      if (data && typeof data === 'object') {
        localStorage.setItem('cohen_cache', JSON.stringify({data, ts:Date.now()}));
        return data;
      }
    } catch(e) { console.warn('FB read:', e.message); }
    try {
      const c = JSON.parse(localStorage.getItem('cohen_cache')||'{}');
      return c.data || {};
    } catch(e) { return {}; }
  },

  async save(path, value) {
    // localStorage first
    try {
      const c = JSON.parse(localStorage.getItem('cohen_cache')||'{"data":{}}');
      if(!c.data) c.data={};
      const keys = path.replace(/^\//,'').split('/');
      let o = c.data;
      for(let i=0;i<keys.length-1;i++){ if(!o[keys[i]])o[keys[i]]={};o=o[keys[i]]; }
      o[keys[keys.length-1]] = value;
      c.ts = Date.now();
      localStorage.setItem('cohen_cache', JSON.stringify(c));
    } catch(e) {}
    // Firebase
    try { await this.set(`/site${path}`, value); return true; }
    catch(e) { console.warn('FB write:', e.message); return false; }
  },

  async uploadImage(file, key) {
    return new Promise(resolve => {
      const r = new FileReader();
      r.onload = async e => {
        const b64 = e.target.result;
        await this.save(`/images/${key}`, b64);
        try { localStorage.setItem(`img_${key}`, b64); } catch(_) {}
        resolve(b64);
      };
      r.readAsDataURL(file);
    });
  },

  getImage(key, data) {
    return data?.images?.[key] || localStorage.getItem(`img_${key}`) || null;
  }
};
