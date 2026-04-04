/* ── config.js ── */
const CONFIG = {
  firebase: 'https://itzikcohen-df9ea-default-rtdb.firebaseio.com',
  serpKey:  '15d2a55c551c967c6ff5e8fcd15f1325a72854e0e55fcb484f59ffde3c1f8ad8',
  serpDid:  '0x678d267f12c9559:0xce676e8f96891c52',
  proxy:    'https://api.codetabs.com/v1/proxy?quest=',
  adminPwDefault: 'cohen2025',

  defaults: {
    name:    'עו"ד יצחק (איציק) כהן',
    role:    'עורך דין ונוטריון',
    motto:   'מכניס את הלב למקצוע',
    quote:   'המקצוע אינו תפקיד גרידא אלא שליחות להשגת שביעות רצון הלקוח',
    about:   'משרד עורך הדין ונוטריון כהן יצחק הינו משרד בוטיק שצבר ניסיון ומוניטין רב בתחום המקרקעין על כל גווניו.',
    mob:     '0526768562',
    office:  '035755722',
    waNum:   '972526768562',
    email:   'itzik.cohen.law@gmail.com',
    fb:      'https://www.facebook.com/profile.php?id=100095657407511',
    photo:   'https://d-cards.co.il/wp-content/uploads/2023/09/cohen.jpg',
    stat1v:  '15+', stat1l: 'שנות ניסיון',
    stat2v:  '500+', stat2l: 'לקוחות',
    stat3v:  '48ש\'', stat3l: 'הקמת חברה',
    waMsgs: {
      gen:  'שלום איציק, אשמח לקבל ייעוץ משפטי. האם תוכל לחזור אליי?',
      land: 'שלום איציק, אני מתעניין/ת בשירותי מקרקעין. האם תוכל לחזור אליי?',
      inh:  'שלום איציק, אני זקוק/ה לייעוץ בנושא ירושה / צוואה / הסכם ממון.',
      co:   'שלום איציק, אני מעוניין/ת בהקמת חברה בע"מ.',
      not:  'שלום איציק, אני זקוק/ה לשירות נוטריון.',
      forr: 'Hello Itzik, I am a foreign resident interested in purchasing real estate in Israel.'
    }
  },

  /* 22 static fallback reviews (real names from SerpAPI) */
  staticReviews: [
    {name:"אופיר שלום אל",av:"https://lh3.googleusercontent.com/a/ACg8ocJ6OQWhChrEaLj6Srb5vZBmowgcxNuhDzJQncQha08nxNcDcQ=s120-c-rp-mo-br100",rating:5,date:"לפני 8 חודשים",text:"ממליץ עליו בחום — ליווה אותנו בכל תהליך רכישת הדירה, היה זמין בכל שעה ביום, קשוב, מקצועי, יסודי ואחראי!"},
    {name:"Dariya Kofman",av:"https://lh3.googleusercontent.com/a/ACg8ocLl4a5oGjyNo4W53AbB3ryzieVg68Bl69lAp40TccPiiO9Ahg=s120-c-rp-mo-ba2-br100",rating:5,date:"לפני 8 חודשים",text:"הפגין מקצועיות, יסודיות וסבלנות יוצאת דופן. היה זמין לכל שאלה, הסביר כל שלב בפירוט ונתן תחושת ביטחון לאורך כל התהליך."},
    {name:"Moshiko lozon",av:"https://lh3.googleusercontent.com/a/ACg8ocIqFIPgfmQy5wllupCGhh6sffFgcqxprcH1G3nYx7CrQMNQpQ=s120-c-rp-mo-br100",rating:5,date:"לפני 11 חודשים",text:"מדובר באיש מקצוע ברמה הגבוהה ביותר. מכיר את החוק על בוריו, מסביר כל שלב בצורה ברורה. כל שאלה זכתה למענה מיידי."},
    {name:"נוי פליישר",av:"https://lh3.googleusercontent.com/a/ACg8ocIzeHQZfYkumrM3O-FsoZAiww5qRNQ-jfmImeM6hVFgQb00jg=s120-c-rp-mo-br100",rating:5,date:"לפני 8 חודשים",text:"איציק הוא עורך דין מקצועי, סבלני וזמין שליווה אותי ברכישת דירה. הסביר הכל בפשטות, ענה על כל שאלה ונתן תחושת ביטחון מלאה."},
    {name:"מירה סבן",av:"https://lh3.googleusercontent.com/a/ACg8ocK8W4Fcq-lqdnatoCvOkeqsIO_J7o1lvXKbF2UnZpZAJfJBSA=s120-c-rp-mo-br100",rating:5,date:"לפני 11 חודשים",text:"זמין כל הזמן, שלח בשמחה כל מסמך שביקשנו, הסביר בקלות כל תהליך ועדכן בכל פעולה. רמת שירות ומקצועיות ברמה גבוהה."},
    {name:"boris kofman",av:"https://lh3.googleusercontent.com/a/ACg8ocLxtHylYuSKPof0ec2gdJS9-22f6PJoysBdsNz92tZc7WKcEA=s120-c-rp-mo-br100",rating:5,date:"לפני 8 חודשים",text:"קודם כול בן אדם. אחר כך עו\"ד מקצוען. עזר לנו במכירה וקניית דירה, זמין לכל בעיה ולכל שאלה. מומלץ מאוד!"},
    {name:"אור סבן",av:"https://lh3.googleusercontent.com/a/ACg8ocKrygkpuEM24eiSMvN_ctMzxt1doLVN3n0iwTmlC0A-diXC4w=s120-c-rp-mo-br100",rating:5,date:"לפני 11 חודשים",text:"עורך דין ברמה — ליווה אותנו מהרגע הראשון, גילה הבנה רבה וסבלנות, מדבר בגובה עיניים. מהיר, יסודי ואמין!"},
    {name:"מיכל חלק",av:"https://lh3.googleusercontent.com/a-/ALV-UjXcSyig46jTpSppDNix_RY2proY9XWMefpcIY6-TUwW_5Ehpz8c=s120-c-rp-mo-ba2-br100",rating:5,date:"לפני 2 שנים",text:"הגעתי בעקבות המלצה ובהחלט אמליץ לכל מכריי. הפך תהליך מלחיץ לרגוע! ראוי להערכה על המקצועיות, הסבלנות והחיוך."},
    {name:"Mental Solutions",av:"",rating:5,date:"לפני שנה",text:"שירות מקצועי ואמין. מומלץ בחום!"},
    {name:"yair saar",av:"",rating:5,date:"לפני שנה",text:"מקצועי, זמין ואמין. ליווה אותנו בעסקת מקרקעין מורכבת בצורה מעולה."},
    {name:"Nastya Karov",av:"",rating:5,date:"לפני שנה",text:"Professional, attentive and very knowledgeable. Made the whole process smooth. Highly recommend!"},
    {name:"גל קוש",av:"",rating:5,date:"לפני שנה",text:"עורך דין מצוין! ליווה אותנו בתהליך רכישת דירה עם הרבה סבלנות ומקצועיות."},
    {name:"דורון בינשטוק",av:"",rating:5,date:"לפני שנה",text:"שירות מהיר ומקצועי. הסביר כל שלב בבירור ותמיד היה זמין לשאלות."},
    {name:"שמעון נניקשוילי",av:"",rating:5,date:"לפני שנה",text:"מרוצה מאוד מהשירות. מקצועי, אמין וזמין תמיד."},
    {name:"שי טמצין",av:"",rating:5,date:"לפני שנה",text:"ממליץ בחום. ליווה אותנו בעסקה מורכבת ועשה זאת בצורה מקצועית ורגועה."},
    {name:"דויד זדה",av:"",rating:5,date:"לפני שנה",text:"שירות מעולה! תמיד זמין, מקצועי ואמין. ממליץ בחום לכולם."},
    {name:"David Halbany",av:"",rating:5,date:"לפני שנה",text:"Excellent service, very professional and always available. Highly recommended!"},
    {name:"איציק צפאני",av:"",rating:5,date:"לפני שנה",text:"מקצועי, אמין וזמין. ממליץ בחום!"},
    {name:"ben shimoni",av:"",rating:5,date:"לפני 2 שנים",text:"Very professional and knowledgeable. Made the whole process smooth and easy."},
    {name:"Natalie V.",av:"",rating:5,date:"לפני 2 שנים",text:"Excellent lawyer! Very professional, thorough and always available."},
    {name:"מתן עמר",av:"",rating:5,date:"לפני 2 שנים",text:"עורך דין מקצועי ואמין. ליווה אותי בתהליך בצורה מעולה."},
    {name:"Eduard Katsman",av:"",rating:5,date:"לפני 2 שנים",text:"Professional and reliable. Highly recommend for any legal matters in Israel."}
  ]
};
