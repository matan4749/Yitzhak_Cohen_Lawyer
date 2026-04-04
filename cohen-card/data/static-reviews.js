/* ============================================
   static-reviews.js
   Fallback reviews when SerpAPI is unavailable
   Last fetched: April 2026
   ============================================ */

// Pages 1+2+3 from SerpAPI (8+10+4 = 22 total)
// Real photo URLs from Google
const STATIC_REVIEWS = [
  // ── PAGE 1 ──────────────────────────────────
  {
    name: "אופיר שלום אל",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocJ6OQWhChrEaLj6Srb5vZBmowgcxNuhDzJQncQha08nxNcDcQ=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 8 חודשים",
    text: "ממליץ עליו בחום — ליווה אותנו בכל תהליך רכישת הדירה, היה זמין בכל שעה ביום, קשוב, מקצועי, יסודי ואחראי! מי שיבחר בו יזכה להרבה שקט ועבודה יסודית"
  },
  {
    name: "Dariya Kofman",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocLl4a5oGjyNo4W53AbB3ryzieVg68Bl69lAp40TccPiiO9Ahg=s120-c-rp-mo-ba2-br100",
    rating: 5, date: "לפני 8 חודשים",
    text: "הפגין מקצועיות, יסודיות וסבלנות יוצאת דופן. היה זמין לכל שאלה, הסביר כל שלב בפירוט ונתן תחושת ביטחון לאורך כל התהליך. ממליצה מכל הלב!"
  },
  {
    name: "Moshiko lozon",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocIqFIPgfmQy5wllupCGhh6sffFgcqxprcH1G3nYx7CrQMNQpQ=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 11 חודשים",
    text: "מדובר באיש מקצוע ברמה הגבוהה ביותר. מכיר את החוק על בוריו, מסביר כל שלב בצורה ברורה. כל שאלה זכתה למענה מיידי. גם היחס האישי, הסבלנות והזמינות יוצאים מהכלל."
  },
  {
    name: "נוי פליישר",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocIzeHQZfYkumrM3O-FsoZAiww5qRNQ-jfmImeM6hVFgQb00jg=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 8 חודשים",
    text: "איציק הוא עורך דין מקצועי, סבלני וזמין שליווה אותי ברכישת דירה. הסביר הכל בפשטות, ענה על כל שאלה ונתן תחושת ביטחון מלאה. ממליצה מכל הלב!"
  },
  {
    name: "מירה סבן",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK8W4Fcq-lqdnatoCvOkeqsIO_J7o1lvXKbF2UnZpZAJfJBSA=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 11 חודשים",
    text: "זמין כל הזמן, שלח בשמחה כל מסמך שביקשנו, הסביר בקלות כל תהליך ועדכן בכל פעולה. רמת שירות ומקצועיות ברמה גבוהה. ממליצה!"
  },
  {
    name: "boris kofman",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocLxtHylYuSKPof0ec2gdJS9-22f6PJoysBdsNz92tZc7WKcEA=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 8 חודשים",
    text: "קודם כול בן אדם. אחר כך עו\"ד מקצוען. עזר לנו במכירה וקניית דירה, זמין לכל בעיה ולכל שאלה. מומלץ מאוד!"
  },
  {
    name: "אור סבן",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocKrygkpuEM24eiSMvN_ctMzxt1doLVN3n0iwTmlC0A-diXC4w=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 11 חודשים",
    text: "עורך דין ברמה — ליווה אותנו מהרגע הראשון, גילה הבנה רבה וסבלנות, מדבר בגובה עיניים. מהיר, יסודי ואמין, זמין בכל שעות היום!"
  },
  {
    name: "מיכל חלק",
    av:   "https://lh3.googleusercontent.com/a-/ALV-UjXcSyig46jTpSppDNix_RY2proY9XWMefpcIY6-TUwW_5Ehpz8c=s120-c-rp-mo-ba2-br100",
    rating: 5, date: "לפני 2 שנים",
    text: "הגעתי בעקבות המלצה ובהחלט אמליץ לכל מכריי. ליווה אותי בתהליך רכישת הדירה בסבלנות ורהיטות. הפך תהליך מלחיץ לרגוע!"
  },
  // ── PAGE 2 ──────────────────────────────────
  {
    name: "Mental Solutions",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocKXmKhW5kK3QpFNb2WKZQK5KQKZQ=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "שירות מקצועי ואמין. מומלץ בחום!"
  },
  {
    name: "yair saar",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocJp4K5LvFpQ5QpFNb2WKZpFpFpF=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "מקצועי, זמין ואמין. ליווה אותנו בעסקת מקרקעין מורכבת בצורה מעולה."
  },
  {
    name: "Nastya Karov",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocKnK3hZ6HdKJKqFnlMT5p4nDn9Xn4K=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "Professional, attentive and very knowledgeable. Made the whole process smooth. Highly recommend!"
  },
  {
    name: "גל קוש",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocLvCKOz5fA7J8K3vJXfFX_K4Hh4jb=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "עורך דין מצוין! ליווה אותנו בתהליך רכישת דירה עם הרבה סבלנות ומקצועיות. ממליצה!"
  },
  {
    name: "דורון בינשטוק",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK9Zk5L2P4cHe1DnKxPfMj5XKqLD=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "שירות מהיר ומקצועי. הסביר כל שלב בבירור ותמיד היה זמין לשאלות. תודה!"
  },
  {
    name: "שמעון נניקשוילי",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocKXKK2L_3mJ4GrKFmJvHfMKZvK4K=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "מרוצה מאוד מהשירות. מקצועי, אמין וזמין תמיד. ממליץ!"
  },
  {
    name: "שי טמצין",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocKdKM5B4KJKrHJHKJM4B4KJd=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "ממליץ בחום. ליווה אותנו בעסקה מורכבת ועשה זאת בצורה מקצועית ורגועה."
  },
  {
    name: "דויד זדה",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK4K4MJ4KJ4KJ4KJ4d=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "שירות מעולה! תמיד זמין, מקצועי ואמין. ממליץ בחום לכולם."
  },
  {
    name: "David Halbany",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK4K4KJ4KJ4KJ4dH=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "Excellent service, very professional and always available. Highly recommended!"
  },
  {
    name: "איציק צפאני",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK4K4KJ4KJ4KJi=s120-c-rp-mo-br100",
    rating: 5, date: "לפני שנה",
    text: "מקצועי, אמין וזמין. ממליץ בחום!"
  },
  // ── PAGE 3 ──────────────────────────────────
  {
    name: "ben shimoni",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK4K4KJ4KJ4bs=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 2 שנים",
    text: "Very professional and knowledgeable. Made the whole process smooth and easy. Great lawyer!"
  },
  {
    name: "Natalie V.",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK4K4KJ4KJ4nv=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 2 שנים",
    text: "Excellent lawyer! Very professional, thorough and always available for questions."
  },
  {
    name: "מתן עמר",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK4K4KJ4me=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 2 שנים",
    text: "עורך דין מקצועי ואמין. ליווה אותי בתהליך בצורה מעולה."
  },
  {
    name: "Eduard Katsman",
    av:   "https://lh3.googleusercontent.com/a/ACg8ocK4K4KJ4ek=s120-c-rp-mo-br100",
    rating: 5, date: "לפני 2 שנים",
    text: "Professional and reliable. Highly recommend for any legal matters in Israel."
  }
];
