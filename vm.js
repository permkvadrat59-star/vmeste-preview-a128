/* «вместе» с нуля, вер 1 от 09.11.2026, правки Ильи 10.11: шапка, подвал, стена силуэтов и все страницы.
   Данные те же, что на прошлом сайте: EVENTS и помощники из events.js, PEOPLE, POSTS, BLOG_CATS, PARTNERS, FORMATS, SITE, TICKER из content.js.
   Страницу выбирает <body data-page="…">. Запись на встречу перенесена с прошлого event.html без изменений логики. */

const PAGE = document.body.dataset.page;
const Q = new URLSearchParams(location.search);
const $ = id => document.getElementById(id);
const MOTION = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const SIL = 12;   // силуэты из ролика «Вместе_Наружу», assets/sil/s01–s12; you.webp — ровный силуэт анфас для «Здесь место для тебя»
const COLORS = ['wine', 'blue', 'green', 'ink'];
const MONTHS_PREP = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];
const NAV = [['calendar.html', 'Афиша', 'calendar'], ['formats.html', 'Форматы', 'formats'], ['team.html', 'Команда', 'team'],
             ['blog.html', 'Блог', 'blog'], ['about.html', 'О нас', 'about'], ['partners.html', 'Партнёрам', 'partners']];
// Форматы партнёрства. 10.11 Илья: вместо «Партнёра запуска» партнёр-участник, плюс ментор или коуч, поддержка и коллаборации.
// «Встреча с предпринимателем» и «Лаборатория» с прошлой страницы «Партнёры». t — название, x — что делает партнёр, get — что получает.
const PARTNER_WAYS = [
  { t: 'Партнёр-участник', x: 'Компания становится частью «Вместе». Помогает пространству вещью, техникой или оплатой конкретной задачи, приходит на встречи и знакомится с ребятами.', get: 'Имя партнёра на сайте, в соцсетях и на встречах' },
  { t: 'Ментор или коуч', x: 'Руководитель или специалист компании сопровождает команду. Раз в месяц разбирает с ребятами задачи и планы, помогает не застрять на первых проектах.', get: 'Опыт наставничества и знакомство с сильными ребятами' },
  { t: 'Поддержка встреч', x: 'Помощь под конкретный вечер или сезон. Угощение, призы, печать, транспорт, площадка для выезда.', get: 'Упоминание в анонсе и на самой встрече' },
  { t: 'Коллаборация', x: 'Общий проект с брендом, кофейней, студией или другим сообществом. Совместный вечер, дроп, выезд, мерч или контент.', get: 'Новая аудитория и история, которую рассказывают обе стороны' },
  { t: 'Встреча с предпринимателем', x: 'Основатель или руководитель приходит на разговор с гостем и рассказывает, как начинал. Ребята задают вопросы.', get: 'Знакомство с теми, кто скоро будет искать работу' },
  { t: 'Лаборатория для компании', x: 'Команда участников берёт реальную задачу компании и за несколько встреч доводит её до прототипа или решения.', get: 'Свежий взгляд и прототип решения' },
];
const JOIN = (PEOPLE.find(p => p.id === 'ilya') || {}).contact || SITE.channel;   // через Илью вступают в команду

const esc = s => String(s ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const cls = c => 'c-' + (COLORS.includes(c) ? c : 'wine');
const hash = s => [...String(s)].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
const ext = href => /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const typing = e => e.altKey || e.ctrlKey || e.metaKey || !!e.target.closest('input, textarea, select, [contenteditable]');
function fmtDate(iso){ const d = parseDay(iso); return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`; }
const crewOf = role => PEOPLE.filter(p => p.role === role && !p.hidden);
const TEAM_SIZE = SITE.teamSize || crewOf('team').length;   // 10.11: в команде 25 человек, карточки на сайте пока не у всех
const people = n => `${n} ${plural(n, 'человек', 'человека', 'человек')}`;

/* ---------- кадры ---------- */
// С 10.11 все фото в своём цвете (Илья: бордовое наложение убрать и с команды). Бордо остаётся у кадров-силуэтов из ролика.
const pic = (src, pos, alt = '') => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" draggable="false" style="object-position:${esc(pos || '50% 40%')}">`;
const silSrc = i => `assets/sil/s${String(((i % SIL) + SIL) % SIL + 1).padStart(2, '0')}.webp`;
const sil = (i, extra = '') => `<div class="tile${i % 2 ? ' m' : ''}${extra}" aria-hidden="true"><img src="${silSrc(i)}" alt="" loading="lazy" draggable="false"></div>`;

/* ---------- встречи ---------- */
const evImg = ev => ev.image || (ev.poster && ev.poster.photo) || '';
const evColor = ev => ev.color || (ev.poster && ev.poster.color) || 'wine';
const evMonth = ev => parseDay(nextDate(ev) || ev.dates[ev.dates.length - 1]).getMonth();
const whenFull = ev => whenLine(ev) || `${MONTHS_NOM[evMonth(ev)]}, дату объявим в канале`;

function row(ev){
  const c = evColor(ev), img = evImg(ev);
  return `<a class="row ${cls(c)}" href="${eventUrl(ev)}">
    <div class="row__img pic">${img ? pic(img, ev.imagePos) : sil(hash(ev.id))}</div>
    <div><p class="row__type"><i class="dot"></i>${esc(ev.type)}</p><h3 class="row__title">${esc(ev.title)}</h3>${ev.text ? `<p class="row__text">${esc(ev.text)}</p>` : ''}</div>
    <p class="row__when"><b>${esc(whenLine(ev) || 'Дата уточняется')}</b>${esc(ev.place || DEFAULT_PLACE).replace(/^Пермь, /, '')}</p>${ARROW}</a>`;
}

/* ---------- люди ---------- */
// rv: проявляться при прокрутке (в ленте не нужно, там копии)
function mate(p, rv = true){
  const img = p.photo ? `<div class="mate__img pic">${pic(p.photo, p.photoPos)}</div>`
                      : `<div class="mate__img tile${hash(p.id) % 2 ? ' m' : ''}"><img src="${silSrc(hash(p.id))}" alt="" loading="lazy" draggable="false"></div>`;
  return `<a class="mate${rv ? ' rv' : ''}" href="person.html?id=${encodeURIComponent(p.id)}" draggable="false">${img}
    <div><p class="mate__name">${esc(p.name)}</p>${p.position ? `<p class="mate__pos">${esc(p.position)}</p>` : ''}</div></a>`;
}
// «Ты?» написано на груди ровного силуэта анфас, как бейдж (10.11: «силуэт прямой, не боковой»)
const youTile = (rv = true) => `<a class="mate mate--you${rv ? ' rv' : ''}" href="${JOIN}"${ext(JOIN)} draggable="false"><div class="mate__img tile"><img src="assets/sil/you.webp" alt="" loading="lazy" draggable="false"><b>Ты?</b></div>
  <div><p class="mate__name">Здесь место для тебя</p><p class="mate__pos">Вступить в команду</p></div></a>`;

/* ---------- лента: одна строка, сама медленно едет, листается пальцем, мышью и стрелками ---------- */
// Три одинаковых набора подряд, смотрим на средний. Уехали на целый набор, незаметно перескакиваем назад, поэтому лента бесконечная.
// Стоит, пока на неё навели мышь, держат фокус или листают сами; потом едет дальше. Без анимаций (настройка системы) не едет, листается руками.
function strip(cards, label){
  const set = copy => `<div class="strip__set"${copy ? ' aria-hidden="true" inert' : ''}>${cards}</div>`;
  return `<div class="strip" role="region" aria-label="${esc(label)}">
    <div class="strip__track">${set(true)}${set(false)}${set(true)}</div>
    <div class="wrap strip__bar"><button class="strip__btn" type="button" data-d="-1" aria-label="Листать назад">${ARROW}</button><button class="strip__btn" type="button" data-d="1" aria-label="Листать вперёд">${ARROW}</button></div>
  </div>`;
}
function initStrips(){
  document.querySelectorAll('.strip').forEach(el => {
    const track = el.querySelector('.strip__track'), sets = track.children, now = () => performance.now();
    let setW = 0, step = 0, pos = 0, mine = -1, hold = 0, hover = false, focus = false, seen = true, resync = false, drag = null, last = 0;
    const measure = () => {
      setW = sets[1].offsetLeft - sets[0].offsetLeft;
      const a = sets[1].children[0], b = sets[1].children[1];
      step = b ? b.offsetLeft - a.offsetLeft : setW;
    };
    const jump = x => { track.scrollLeft = x; pos = mine = track.scrollLeft; };
    const wrap = () => { const x = track.scrollLeft; if (x < setW * .5) jump(x + setW); else if (x > setW * 1.5) jump(x - setW); };
    const pause = ms => { hold = Math.max(hold, now() + ms); resync = true; };
    measure(); jump(setW);
    // фото ленты грузим заранее, когда до неё остаётся экран: иначе карточки въезжают пустыми и проявляются на глазах
    if ('IntersectionObserver' in window) {
      const pre = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; }); pre.disconnect(); } }, { rootMargin: '900px 0px' });
      pre.observe(el);
    }
    addEventListener('resize', debounce(() => { const k = track.scrollLeft / setW; measure(); jump(k * setW); wrap(); }, 200));

    el.querySelectorAll('.strip__btn').forEach(b => b.addEventListener('click', () => {
      pause(4000); wrap();
      track.scrollBy({ left: Number(b.dataset.d) * step, behavior: MOTION ? 'smooth' : 'auto' });
    }));
    // мышью можно тянуть ленту; если тянули, клик по карточке не открывает страницу
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button) { pause(3000); return; }
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
    });
    addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; track.classList.add('is-drag'); }
      if (drag.moved) { track.scrollLeft = drag.left - dx; mine = track.scrollLeft; }
    });
    addEventListener('pointerup', () => {
      if (!drag) return;
      const moved = drag.moved; drag = null; track.classList.remove('is-drag');
      pause(2500); wrap();
      if (!moved) return;
      const stop = e => { e.preventDefault(); e.stopPropagation(); };
      track.addEventListener('click', stop, true);
      setTimeout(() => track.removeEventListener('click', stop, true), 0);
    });
    track.addEventListener('dragstart', e => e.preventDefault());
    track.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) pause(2500); }, { passive: true });
    const settle = debounce(() => { if (!drag) wrap(); }, 160);
    track.addEventListener('scroll', () => { if (Math.abs(track.scrollLeft - mine) > 2) { pause(2200); settle(); } }, { passive: true });
    el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
    el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hover = false; pause(700); } });
    el.addEventListener('focusin', () => { focus = true; });
    el.addEventListener('focusout', () => { focus = false; pause(1500); });

    if (!MOTION) return;
    const SPEED = 32;   // пикселей в секунду
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { seen = e.isIntersecting; }).observe(el);
    requestAnimationFrame(function tick(t){
      requestAnimationFrame(tick);
      const dt = Math.min(50, t - (last || t)); last = t;
      if (!seen || hover || focus || drag || document.hidden || now() < hold) return;
      if (resync) { wrap(); pos = track.scrollLeft; resync = false; }
      pos += SPEED * dt / 1000;
      if (pos > setW * 1.5) pos -= setW;
      track.scrollLeft = pos; mine = track.scrollLeft;
    });
  });
}

/* ---------- блог ---------- */
const postsSorted = () => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
function postCard(p){
  const href = `post.html?id=${encodeURIComponent(p.id)}`;
  return `<article class="post rv"><a class="post__img pic" href="${href}" tabindex="-1" aria-hidden="true">${pic(p.image, p.imagePos)}</a>
    <p class="kick">${esc(p.cat || p.kind)} · ${fmtDate(p.date)}</p><h3 class="post__title h-s"><a href="${href}">${esc(p.title)}</a></h3>
    ${p.lead ? `<p class="post__lead">${esc(p.lead)}</p>` : ''}<a class="more" href="${href}">Читать ${ARROW}</a></article>`;
}
// Пустые места в строке закрывает заглушка с силуэтом, как постер «Завтра здесь может появиться новое событие» в афише
const STUBS = ['Скоро здесь новая запись', 'Готовим рассказ о встрече', 'Следующая история уже пишется'];
const postStub = (i, cat) => `<a class="post post--stub rv" href="${SITE.channel}"${ext(SITE.channel)}><div class="post__img tile${i % 2 ? ' m' : ''}"><img src="${silSrc(i * 5 + 2)}" alt="" loading="lazy" draggable="false"></div>
  <p class="kick">${esc(cat || 'Скоро')}</p><h3 class="post__title h-s">${STUBS[i % STUBS.length]}</h3><p class="post__lead">Новые записи и анонсы сначала выходят в канале.</p><span class="more">В канал ${ARROW}</span></a>`;
function postGrid(list, cat){
  const n = list.length ? (3 - list.length % 3) % 3 : 3;
  return `<div class="posts">${list.map(postCard).join('')}${Array.from({ length: n }, (_, i) => postStub(list.length + i, cat)).join('')}</div>`;
}

/* ---------- шапка и подвал ---------- */
function head(){
  const cur = { event: 'calendar', archive: 'calendar', person: 'team', post: 'blog' }[PAGE] || PAGE;
  const links = () => NAV.map(([h, l, id]) => `<a href="${h}"${id === cur ? ' aria-current="page"' : ''}>${l}</a>`).join('');
  const hd = $('hd');
  hd.innerHTML = `<div class="wrap hd__in">
    <a class="hd__logo" href="index.html" aria-label="вместе, на главную"><img src="assets/brand/wordmark-paper.svg" alt="вместе" width="113" height="26"></a>
    <nav class="hd__nav" aria-label="Разделы">${links()}</nav>
    <a class="btn btn--sm hd__cta" href="${SITE.channel}"${ext(SITE.channel)}>Вступить</a>
    <button class="hd__burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><span></span></button>
  </div>
  <div class="menu" id="menu" hidden role="dialog" aria-modal="true" aria-label="Меню">
    <div class="menu__top"><img src="assets/brand/wordmark-paper.svg" alt="вместе" width="113" height="26"><button class="menu__close" type="button" aria-label="Закрыть меню">×</button></div>
    <nav aria-label="Разделы">${links()}</nav>
    <div class="menu__foot"><a class="btn" href="${SITE.channel}"${ext(SITE.channel)}>Вступить</a>
      <a href="${SITE.channel}"${ext(SITE.channel)}>Телеграм-канал</a><a href="${SITE.instagram}"${ext(SITE.instagram)}>Инстаграм</a><span>${esc(SITE.address)}</span></div>
  </div>`;
  const menu = $('menu'), burger = hd.querySelector('.hd__burger');
  const toggle = open => { menu.hidden = !open; burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : ''; if (open) menu.querySelector('.menu__close').focus(); };
  burger.addEventListener('click', () => toggle(true));
  menu.querySelector('.menu__close').addEventListener('click', () => { toggle(false); burger.focus(); });
  menu.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { toggle(false); burger.focus(); } });
  const solid = () => hd.classList.toggle('is-solid', scrollY > 8);
  solid(); addEventListener('scroll', solid, { passive: true });
}
function foot(){
  $('ft').innerHTML = `<div class="wrap">
    <div class="ft__cols">
      <div><p class="ft__say">${esc(SITE.slogan)}</p></div>
      <div><h3>Разделы</h3><ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>
      <div><h3>Связь</h3><ul><li><a href="${SITE.channel}"${ext(SITE.channel)}>Телеграм-канал</a></li><li><a href="${SITE.instagram}"${ext(SITE.instagram)}>Инстаграм</a></li><li><a href="${SITE.telegram}"${ext(SITE.telegram)}>Написать нам</a></li></ul></div>
      <div><h3>Адрес</h3><ul><li>${esc(SITE.address).replace(/, (\d)/g, ',&nbsp;$1')}</li><li>${esc(SITE.building)}</li><li><a href="index.html#where">Как дойти</a></li></ul></div>
    </div>
    <div class="ft__mark"><img src="assets/brand/wordmark-paper.svg" alt="" width="512" height="118" loading="lazy"></div>
    <div class="ft__base"><span>© 2026 вместе, Пермь</span><span><a class="link" href="privacy.html">Политика</a> · <a class="link" href="consent.html">Согласие на обработку данных</a></span></div>
  </div>`;
}

/* ---------- появление при прокрутке ---------- */
let io = null;
function reveal(){
  if (!MOTION || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('mo');
  io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { rootMargin: '0px 0px -6% 0px', threshold: .06 });
  document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
}

/* ---------- первый экран: стена кадров как в ролике ---------- */
// Кадры загораются по очереди от центра к краям, потом стена живёт: кадр гаснет и через пару секунд загорается уже с другим
// силуэтом (кто-то ушёл, кто-то пришёл), другой коротко моргает. Это смена яркости, а не движение, поэтому работает при любой
// настройке (10.11, Илья: «чтобы дать живость хиро»). Колонки едут навстречу друг другу, только если движение не выключено в системе.
function buildWall(){
  const wall = $('wall'); if (!wall) return;
  const hero = wall.parentElement;
  let anims = [], tiles = [], seen = true, lastW = innerWidth;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const all = k => wall.querySelectorAll(`[data-k="${k}"]`);
  // моргнул: два коротких провала яркости
  const flick = (k, at = 0) => [0, 90, 200, 290].forEach((d, i) => later(() => all(k).forEach(el => el.classList.toggle('flick', !(i % 2))), at + d));
  function life(){
    later(life, 650 + Math.random() * 900);
    if (!seen || document.hidden || !tiles.length) return;
    const t = tiles[Math.floor(Math.random() * tiles.length)];
    if (Math.random() < .35) return flick(t.k);
    const els = all(t.k);
    els.forEach(el => el.classList.add('off'));
    later(() => {
      const s = Math.floor(Math.random() * SIL), m = Math.random() < .5;
      els.forEach(el => { el.querySelector('img').src = silSrc(s); el.classList.toggle('m', m); el.classList.remove('off'); });
    }, 1100 + Math.random() * 1800);
  }
  function make(intro){
    anims.forEach(a => a.cancel()); anims = []; timers.forEach(clearTimeout); timers.clear(); tiles = [];
    const W = hero.clientWidth, H = hero.clientHeight;
    const gap = parseFloat(getComputedStyle(wall).columnGap) || 10;
    const tw = Math.min(214, Math.max(118, innerWidth * .134)), th = tw * 248 / 194, step = th + gap;
    let cols = Math.ceil((W + tw) / (tw + gap)); if (cols % 2 === 0) cols++;
    const rows = Math.ceil(H / step) + 2, cx = (cols - 1) / 2;
    let html = '';
    for (let c = 0; c < cols; c++) {
      const off = c % 2 ? .5 : 0;
      let col = '';
      for (let copy = 0; copy < (MOTION ? 2 : 1); copy++) {
        for (let r = 0; r < rows; r++) {
          const k = c * rows + r, s = (c * 5 + r * 7 + c * r) % SIL;
          col += `<div class="tile${(c + r) % 2 ? ' m' : ''}${intro ? '' : ' on'}" data-k="${k}"><img src="${silSrc(s)}" alt=""></div>`;
          if (!copy) tiles.push({ k, d: Math.hypot(c - cx, (r * step - off * th + th / 2 - H / 2) / step * 1.15) + Math.random() * 1.4 });
        }
      }
      html += `<div class="wall__col" style="--o:${off}">${col}</div>`;
    }
    wall.style.setProperty('--tw', tw + 'px');
    wall.innerHTML = html;
    if (intro) {
      // как в ролике: кадры загораются по одному от центра, некоторые при этом моргают, как лампа при включении
      tiles.sort((a, b) => a.d - b.d);
      const each = 3400 / tiles.length;
      tiles.forEach((t, i) => later(() => { all(t.k).forEach(el => el.classList.add('on')); if (Math.random() < .22) flick(t.k, 160); }, 300 + i * each));
    }
    later(life, intro ? 4200 : 1200);
    if (!MOTION) return;
    wall.querySelectorAll('.wall__col').forEach((col, c) => {
      anims.push(col.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-rows * step}px)` }],
        { duration: (70 + (c % 3) * 16) * 1000, iterations: Infinity, direction: c % 2 ? 'reverse' : 'normal' }));
    });
  }
  make(true);
  addEventListener('resize', debounce(() => { if (Math.abs(innerWidth - lastW) > 40) { lastW = innerWidth; make(false); } }, 250));
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { seen = e.isIntersecting; anims.forEach(a => seen ? a.play() : a.pause()); }).observe(hero);
}

// «вместе ярче, быстрее, креативнее, круче, масштабнее, смелее»: слова под логотипом сменяются по очереди (10.11, Илья).
// Слова стоят в разметке (build_pages.py, HERO_WORDS). Без анимаций движения слово не выезжает, а проявляется.
function heroWords(){
  const words = [...document.querySelectorAll('.hero__w')]; if (words.length < 2) return;
  let i = words.findIndex(w => w.classList.contains('is-on')); if (i < 0) i = 0;
  setInterval(() => {
    if (document.hidden) return;
    const out = words[i];
    out.classList.replace('is-on', 'is-out');
    setTimeout(() => out.classList.remove('is-out'), 900);
    i = (i + 1) % words.length;
    words[i].classList.add('is-on');
  }, 2300);
}

// бегущая строка из TICKER: две одинаковые половины, едет ровно на ширину одной
function runLine(){
  const el = $('run'); if (!el || typeof TICKER === 'undefined') return;
  const set = hidden => `<div class="run__set"${hidden ? ' aria-hidden="true"' : ''}>${TICKER.map(t => `<span>${esc(t)}</span>`).join('')}</div>`;
  el.innerHTML = `<div class="run__track">${set(false)}${MOTION ? set(true) : ''}</div>`;
  if (!MOTION) return;
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    const tr = el.firstChild, w = tr.firstChild.offsetWidth;
    tr.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-w}px)` }], { duration: w / 42 * 1000, iterations: Infinity });
  });
}

/* ---------- главная ---------- */
function home(){
  buildWall();
  heroWords();
  runLine();
  const up = upcomingEvents(), team = crewOf('team');
  const m = up.length ? evMonth(up[0]) : -1, inMonth = up.filter(e => evMonth(e) === m).length;
  $('mani-about').textContent = SITE.about;
  $('facts').innerHTML = [
    [TEAM_SIZE, `${plural(TEAM_SIZE, 'человек', 'человека', 'человек')} в команде`],
    [FORMATS.length, `${plural(FORMATS.length, 'формат', 'формата', 'форматов')} встреч`],
    ...(inMonth ? [[inMonth, `${plural(inMonth, 'встреча', 'встречи', 'встреч')} в ${MONTHS_PREP[m]}`]] : []),
  ].map(([n, t]) => `<li><b class="num">${n}</b><span>${t}</span></li>`).join('');

  $('formats-list').innerHTML = FORMATS.map((f, i) => {
    const n = up.filter(e => e.type === f.name).length;
    return `<a class="fm__row ${cls(f.color)} rv" href="formats.html#fm-${i + 1}">
      <span class="fm__n num">0${i + 1}</span><h3 class="fm__name h-m"><i class="dot"></i>${esc(f.name)}</h3>
      <p class="fm__text">${esc(f.text)}</p><span class="fm__go"><span>${n ? `${n} ${plural(n, 'встреча', 'встречи', 'встреч')}` : 'Скоро'}</span>${ARROW}</span></a>`;
  }).join('');

  $('home-events').innerHTML = up.length ? posterMosaic(up.slice(0, 6), { teaser: false }) : '<p class="empty">Новые встречи скоро появятся. Анонсы выходят в канале.</p>';

  $('team-lead').textContent = `${people(TEAM_SIZE)}, у каждого своё дело: дизайн, видео, тексты, мероприятия, партнёрства. Нажми на кадр, откроется страница человека.`;
  $('crew').innerHTML = strip(team.map(p => mate(p, false)).join('') + youTile(false), 'Команда');

  const posts = postsSorted();
  if (posts.length) $('home-posts').innerHTML = postGrid(posts.slice(0, 3)); else $('blog').hidden = true;

  partnersBlock();
  whereBlock();
}
function partnerLogos(){
  return PARTNERS.filter(p => p.status === 'partner').map(p => {
    const inner = p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">` : `<span>${esc(p.name)}</span>`;
    return p.url ? `<a href="${esc(p.url)}"${ext(p.url)} title="${esc(p.name)}">${inner}</a>` : inner;
  }).join('');
}
function partnersBlock(){
  $('pt-ways').innerHTML = PARTNER_WAYS.map((w, i) => `<li class="rv" style="--d:${(i % 3) * .08}s"><span class="fat num">0${i + 1}</span><h3 class="h-s">${w.t}</h3><p>${w.x}</p></li>`).join('');
  const logos = partnerLogos();
  $('pt-logos').innerHTML = logos ? `<span class="kick">С нами</span>${logos}` : '';
}
// Как найти: живая Яндекс-карта (10.11, Илья: «карту онлайн, чтобы можно было двигать»).
// Пока по карте не нажали, она не ловит прокрутку страницы; увели мышь или прокрутили мимо, снова закрыта.
function whereBlock(){
  const el = $('where-addr'); if (!el) return;
  el.innerHTML = `${esc(SITE.address.replace(/^Пермь, (ул\. )?/, ''))}<small>${esc(SITE.entrance)}. Если заблудился, напиши в Телеграм, встретим.</small>`;
  $('where-steps').innerHTML = SITE.route.map(s => `<li>${esc(s)}</li>`).join('');
  $('where-btns').innerHTML = `<a class="btn" href="${SITE.mapLink}"${ext(SITE.mapLink)}>Открыть в Яндекс Картах</a><a class="btn btn--line" href="${SITE.telegram}"${ext(SITE.telegram)}>Написать в Телеграм</a>`;
  const box = $('where-map');
  box.innerHTML = `<iframe src="${esc(SITE.mapUrl)}" title="Яндекс Карта, Ленина, 44" loading="lazy" allowfullscreen></iframe>
    <button class="map__cover" type="button"><span>Нажми, чтобы двигать карту</span></button>`;
  const live = on => box.classList.toggle('is-live', on);
  box.querySelector('.map__cover').addEventListener('click', () => live(true));
  box.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') live(false); });
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { if (!e.isIntersecting) live(false); }).observe(box);
  $('where-pics').innerHTML = [
    [SITE.routeImageFull || SITE.routeImage, SITE.routeImage, 'Схема пути'],
    [POSTS[0] ? `post.html?id=${POSTS[0].id}` : 'about.html', 'assets/img/hall-now.webp', 'Пространство'],
  ].filter(([, img]) => img).map(([h, img, t]) => `<a href="${esc(h)}"${ext(h)}><img src="${esc(img)}" alt="${t}" loading="lazy"><figcaption>${t}</figcaption></a>`).join('');
}

/* ---------- афиша и архив ---------- */
// 10.11, Илья: на экране один месяц, соседние листаются стрелками. Справа «Архив мероприятий»: та же страница, только прошедшие месяцы.
// Месяц хранится в адресе (?m=2026-12), формат тоже (?f=Тренинг), так ссылку можно переслать.
const monthKey = iso => { const d = parseDay(iso); return d.getFullYear() * 12 + d.getMonth(); };
const keyStr = k => `${Math.floor(k / 12)}-${String(k % 12 + 1).padStart(2, '0')}`;
function calendar(archive = false){
  const all = archive ? pastEvents() : upcomingEvents();
  const day = ev => archive ? ev.dates[ev.dates.length - 1] : (nextDate(ev) || ev.dates[ev.dates.length - 1]);
  const types = [...new Set(all.map(e => e.type))];
  let f = Q.get('f'); if (!types.includes(f)) f = null;
  let cur = Q.get('m');
  $('cal-lead').innerHTML = archive ? 'Встречи, которые уже прошли, по месяцам. Отчёты и кадры ищи в <a class="link" href="blog.html">блоге</a>.'
    : SHOW_DATES ? 'Встречи на ближайшие месяцы. Запись открыта на странице каждой встречи.'
    : `Встречи на ближайшие месяцы. Точные даты объявляем в <a class="link" href="${SITE.channel}"${ext(SITE.channel)}>канале</a>, как только договоримся с гостями.`;
  const chips = $('chips'), nav = $('mnav'), cal = $('cal');
  const label = k => MONTHS_NOM[k % 12] + (Math.floor(k / 12) !== new Date().getFullYear() ? ` ${Math.floor(k / 12)}` : '');
  function draw(dir = 0){
    const list = f ? all.filter(e => e.type === f) : all;
    const ms = [...new Set(list.map(e => monthKey(day(e))))].sort((a, b) => a - b);
    let k = ms.find(x => keyStr(x) === cur);
    if (k === undefined) k = archive ? ms[ms.length - 1] : ms[0];
    cur = k === undefined ? null : keyStr(k);
    chips.hidden = types.length < 2;
    chips.innerHTML = [null, ...types].map(t => `<button class="chip ${cls(t ? fmtColor(t) : 'wine')}" type="button" data-f="${esc(t || '')}" aria-pressed="${t === f}">${t ? '<i class="dot"></i>' : ''}${esc(t || 'Все')}</button>`).join('');
    if (k === undefined) {
      nav.innerHTML = '';
      cal.innerHTML = archive
        ? `<div class="cal-empty"><div class="cal-empty__tiles">${sil(2)}${sil(7)}${sil(10)}</div><div><h2 class="h-m">Архив пока пустой</h2><p class="lead">Сюда попадают встречи, когда они прошли. Первые уже в афише.</p><div class="btns"><a class="btn" href="calendar.html">Ближайшие встречи</a></div></div></div>`
        : `<div class="cal-empty"><div class="cal-empty__tiles">${sil(1)}${sil(4)}${sil(9)}</div><div><h2 class="h-m">Скоро новые встречи</h2><p class="lead">Анонсы выходят сначала в канале.</p><div class="btns"><a class="btn" href="${SITE.channel}"${ext(SITE.channel)}>Канал в Телеграме</a></div></div></div>`;
      return;
    }
    const i = ms.indexOf(k), prev = ms[i - 1], next = ms[i + 1];
    const ev = list.filter(e => monthKey(day(e)) === k);
    const btn = (to, d) => `<button class="mnav__btn" type="button" data-d="${d}"${to === undefined ? ' disabled' : ` data-to="${keyStr(to)}"`} aria-label="${to === undefined ? (d < 0 ? 'Раньше встреч нет' : 'Дальше встреч нет') : (d < 0 ? 'Назад, ' : 'Вперёд, ') + label(to)}">${ARROW}</button>`;
    nav.innerHTML = `${btn(prev, -1)}${btn(next, 1)}<div class="mnav__m" aria-live="polite"><h2>${label(k).toUpperCase()}</h2><span>${ev.length} ${plural(ev.length, 'встреча', 'встречи', 'встреч')}${ms.length > 1 ? ` · месяц ${i + 1} из ${ms.length}` : ''}</span></div>`;
    cal.innerHTML = posterMosaic(ev, { teaser: !archive });
    if (dir && MOTION) cal.animate([{ opacity: 0, transform: `translateX(${dir * 32}px)` }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' });
    const qs = new URLSearchParams();
    if (cur && k !== (archive ? ms[ms.length - 1] : ms[0])) qs.set('m', cur);
    if (f) qs.set('f', f);
    history.replaceState(null, '', qs.toString() ? `?${qs}` : location.pathname);
  }
  nav.addEventListener('click', e => {
    const b = e.target.closest('.mnav__btn'); if (!b || b.disabled) return;
    cur = b.dataset.to; draw(Number(b.dataset.d));
  });
  chips.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    f = b.dataset.f || null; draw();
  });
  addEventListener('keydown', e => {
    if (typing(e) || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    const b = nav.querySelector(`.mnav__btn[data-d="${e.key === 'ArrowLeft' ? -1 : 1}"]`);
    if (b && !b.disabled) b.click();
  });
  draw();
}
const fmtColor = name => (FORMATS.find(f => f.name === name) || {}).color || 'wine';

/* ---------- форматы: отдельная страница (10.11, Илья: «уводит на главную снова») ---------- */
function formatsPage(){
  const up = upcomingEvents();
  $('fmt-lead').textContent = `${FORMATS.length} ${plural(FORMATS.length, 'формат', 'формата', 'форматов')}, у каждого свой цвет. Какой формат в какой день, объявляем в афише и в канале. Вход бесплатный.`;
  $('fmt-index').innerHTML = FORMATS.map((f, i) => `<a class="chip ${cls(f.color)}" href="#fm-${i + 1}"><i class="dot"></i>${esc(f.name)}</a>`).join('');
  $('fmt-list').innerHTML = FORMATS.map((f, i) => {
    const ev = up.filter(e => e.type === f.name);
    return `<section class="fmt ${cls(f.color)}" id="fm-${i + 1}" aria-labelledby="fm-h${i + 1}">
      <div class="fmt__info rv">
        <span class="fmt__n fat num">0${i + 1}</span>
        <h2 class="fmt__name" id="fm-h${i + 1}">${esc(f.name)}</h2>
        <p class="lead">${esc(f.text)}</p>
        <div class="btns">${ev.length ? `<a class="btn" href="calendar.html?f=${encodeURIComponent(f.name)}">Смотреть в афише</a>` : `<a class="btn" href="${SITE.channel}"${ext(SITE.channel)}>Следить в канале</a>`}
          <p class="fmt__count"><i class="dot"></i>${ev.length ? `${ev.length} ${plural(ev.length, 'встреча', 'встречи', 'встреч')} в афише` : 'Скоро в афише'}</p></div>
      </div>
      <div class="fmt__ev">${ev.length ? posterMosaic(ev.slice(0, 3), { teaser: false }) + (ev.length > 3 ? `<a class="more" href="calendar.html?f=${encodeURIComponent(f.name)}">Ещё ${ev.length - 3} в афише ${ARROW}</a>` : '')
        : `<a class="fmt__soon" href="${SITE.channel}"${ext(SITE.channel)}>${sil(i * 3 + 1)}<div><p class="h-s">Даты объявим в канале</p><p>Как только договоримся, встреча появится здесь и в афише.</p></div></a>`}</div>
    </section>`;
  }).join('');
  // переход с главной на конкретный формат: страница дорисована скриптом, поэтому к якорю едем сами
  const t = location.hash && document.querySelector(location.hash);
  if (t) requestAnimationFrame(() => t.scrollIntoView());
}

/* ---------- встреча ---------- */
function eventPage(){
  const ev = eventById(Q.get('id')), main = $('page');
  if (!ev) return notFound(main, 'Такой встречи нет. Может, её уже убрали из афиши.', 'calendar.html', 'Вся афиша');
  document.title = `${ev.title} · вместе`;
  const c = evColor(ev), img = evImg(ev);
  const guests = (ev.people || []).map(id => PEOPLE.find(p => p.id === id)).filter(Boolean);
  const more = upcomingEvents().filter(e => e.id !== ev.id).sort((a, b) => (b.type === ev.type) - (a.type === ev.type)).slice(0, 4);
  const blk = (h, body) => `<section class="blk"><h2 class="blk__h">${h}</h2><div>${body}</div></section>`;
  main.innerHTML = `<section class="wrap ev-top ${cls(c)}">
      <div>
        <a class="back" href="calendar.html">${ARROW}Вся афиша</a>
        <p class="ev-type"><i class="dot"></i>${esc(ev.type)}</p>
        <h1 class="ev-title">${esc(ev.title)}</h1>
        ${ev.text ? `<p class="lead">${esc(ev.text)}</p>` : ''}
        <dl class="meta"><div><dt>Когда</dt><dd>${esc(whenFull(ev))}</dd></div><div><dt>Где</dt><dd>${esc(ev.place || DEFAULT_PLACE)}</dd></div><div><dt>Вход</dt><dd>Бесплатно, по записи</dd></div></dl>
        <div class="btns"><a class="btn" href="#reg">${esc(ev.action || 'Записаться')}</a><a class="btn btn--line" href="${SITE.channel}"${ext(SITE.channel)}>Анонсы в канале</a></div>
      </div>
      <div class="ev-pic pic">${img ? pic(img, ev.imagePos, ev.title) : sil(hash(ev.id))}</div>
    </section>
    <div class="wrap ${cls(c)}">
      ${ev.about ? blk('О встрече', `<div class="prose">${ev.about.map(p => `<p>${esc(p)}</p>`).join('')}</div>`) : ''}
      ${ev.program ? blk('Как пройдёт', `<ol class="prog">${ev.program.map(([t, x]) => `<li><b>${esc(t)}</b><p>${esc(x)}</p></li>`).join('')}</ol>`) : ''}
      ${guests.length ? blk(guests.length > 1 ? 'Ведут' : 'Гость', `<div class="people">${guests.map(p => mate(p)).join('')}</div>`) : ''}
      ${ev.photos && ev.photos.length ? blk('Кадры', `<div class="gal">${ev.photos.map(p => `<figure><img src="${esc(p.src)}" alt="${esc(p.note || '')}" loading="lazy">${p.note ? `<figcaption>${esc(p.note)}</figcaption>` : ''}</figure>`).join('')}</div>`) : ''}
      <section class="blk" id="reg"><h2 class="blk__h">Запись</h2><div class="reg" id="reg-box"></div></section>
    </div>
    ${more.length ? `<section class="sec--tight ev-more"><div class="wrap"><div class="shead"><h2 class="blk__h">Ещё встречи</h2><a class="more" href="calendar.html">Вся афиша ${ARROW}</a></div><div class="pfeed">${more.map(e => posterHTML(e)).join('')}</div></div></section>` : ''}`;
  registration(ev);
}

// Запись: с сервером (REG_ENDPOINT и бот) заявка уходит на сервер и подтверждается в Телеграме;
// без сервера собирается готовое сообщение, человек отправляет его в Телеграм сам. Как на прошлом сайте.
function registration(ev){
  const box = $('reg-box');
  const source = Q.get('from') || Q.get('utm_source') || (document.referrer ? new URL(document.referrer).hostname : 'прямой заход');
  const days = openDates(ev);
  let seats = {};
  if (!days.length) {
    box.innerHTML = `<p class="reg__h">Запись закрыта</p><p class="reg__sub">Эта встреча уже прошла. Посмотри ближайшие в афише.</p><div class="btns"><a class="btn" href="calendar.html">Вся афиша</a></div>`;
    return;
  }
  if (regNotOpenYet(ev)) {
    const o = new Date(regOpensAt(ev).getTime() + 5 * 3600e3), pad = n => String(n).padStart(2, '0');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vmeste//RU', 'BEGIN:VEVENT', `UID:${ev.id}-open@vmeste`,
      `DTSTART;TZID=Asia/Yekaterinburg:${o.getUTCFullYear()}${pad(o.getUTCMonth() + 1)}${pad(o.getUTCDate())}T${pad(o.getUTCHours())}${pad(o.getUTCMinutes())}00`,
      `SUMMARY:Открылась запись: ${ev.title}`, `LOCATION:${ev.place || DEFAULT_PLACE}`, `URL:${location.href.split('#')[0]}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    box.innerHTML = `<p class="reg__h">Запись скоро</p><p class="reg__sub">Добавь напоминание в календарь, чтобы не пропустить. Страница сама откроет запись, когда придёт время.</p>
      <p class="seat">${esc(seatLine(ev, days[0], {}))}</p><div class="btns"><a class="btn" download="vmeste.ics" href="${URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))}">Напомнить</a></div>`;
    setTimeout(() => location.reload(), Math.min(regOpensAt(ev) - new Date() + 1000, 2 ** 31 - 1));
    return;
  }
  const capA = 2 + Math.floor(Math.random() * 8), capB = 2 + Math.floor(Math.random() * 8);
  const multi = ev.dates.length > 1 && dateKnown(ev);
  box.innerHTML = `<p class="reg__h">${esc(ev.action || 'Записаться')}</p><p class="reg__sub">Оставь имя и телефон. Подтвердим запись в Телеграме.</p><p class="seat" id="seat-line" hidden></p>
    <form class="form" id="reg-form" novalidate>
      ${multi ? `<label class="field field--wide"><span>День</span><select name="day">${days.map(d => `<option value="${d}">${fmtDay(d)}</option>`).join('')}</select></label>` : ''}
      <label class="field"><span>Имя</span><input name="name" autocomplete="given-name" required maxlength="80"></label>
      <label class="field"><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+7" maxlength="20"></label>
      <label class="field"><span>Сколько вас придёт</span><select name="people"><option value="1">Только я</option><option value="2">Я и ещё один</option><option value="3">Я и ещё двое</option></select></label>
      <label class="field"><span>Откуда узнали</span><select name="heard"><option value="">Выберите</option><option>От друзей</option><option>Телеграм</option><option>Вуз</option><option>Деловая Россия</option><option>Другое</option></select></label>
      <label class="field field--wide"><span>Вопрос или пожелание <small>необязательно</small></span><textarea name="comment" rows="3" maxlength="500"></textarea></label>
      <label class="hp" aria-hidden="true">Сайт<input name="website" tabindex="-1" autocomplete="off"></label>
      <label class="field captcha"><span>Проверка, что ты не робот</span><span class="captcha__row"><span>Сколько будет ${capA} + ${capB}?</span><input name="captcha" inputmode="numeric" autocomplete="off" required maxlength="3" aria-label="Ответ"></span></label>
      <label class="check"><input type="checkbox" name="consent" required><span>Даю <a class="link" href="consent.html" target="_blank">согласие</a> на обработку персональных данных по <a class="link" href="privacy.html" target="_blank">политике</a></span></label>
      <p class="form__err" id="form-error" hidden role="alert"></p>
      <button class="btn" type="submit" id="reg-submit">Отправить</button>
    </form>`;
  const form = $('reg-form'), err = $('form-error'), btn = $('reg-submit');
  const day = () => (multi && form.day.value) || days[0];
  function refreshSeats(){
    const t = seatLine(ev, day(), seats), line = $('seat-line');
    line.textContent = t; line.hidden = !t;
    const s = seats[`${ev.id}|${day()}`];
    btn.textContent = ev.capacity && s && s.taken >= ev.capacity ? 'В лист ожидания' : 'Отправить';
  }
  if (multi) form.day.addEventListener('change', refreshSeats);
  refreshSeats();
  loadSeats().then(s => { seats = s; refreshSeats(); });
  const confirm = (text, href, msg, note) => {
    box.innerHTML = `<p class="reg__h">Последний шаг</p><p class="reg__sub">${esc(text)}</p>
      ${msg ? `<textarea class="copy" id="confirm-msg" readonly>${esc(msg)}</textarea>` : ''}
      <div class="btns">${msg ? '<button class="btn btn--line" type="button" id="copy-btn">Скопировать</button>' : ''}<a class="btn" href="${href}"${ext(href)}>Открыть Телеграм</a></div>
      ${note ? `<p class="seat">${esc(note)}</p>` : ''}`;
    if (msg) $('copy-btn').addEventListener('click', e => { navigator.clipboard && navigator.clipboard.writeText(msg); e.target.textContent = 'Скопировано'; });
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = form, fail = t => { err.innerHTML = t; err.hidden = false; };
    err.hidden = true;
    if (!f.name.value.trim() || f.phone.value.replace(/\D/g, '').length < 10) return fail('Укажи имя и телефон.');
    if (!f.consent.checked) return fail('Нужно согласие на обработку данных.');
    if (f.website.value) return;   // бот
    if (Number(f.captcha.value) !== capA + capB) return fail('Проверь ответ в примере.');

    if (!REG_ENDPOINT || !BOT_USERNAME) {
      const when = dateKnown(ev) ? `, ${fmtDay(day())}` : '';
      const n = Number(f.people.value), who = n === 1 ? 'приду один' : n === 2 ? 'придём вдвоём' : 'придём втроём';
      const msg = `Привет! Хочу на встречу «${ev.title}»${when}. Меня зовут ${f.name.value.trim()}, ${who}.${f.comment.value.trim() ? ' ' + f.comment.value.trim() : ''}`;
      return confirm('Отправь это сообщение нам в Телеграм, и место за тобой.', CONTACT_TG, msg, 'Откроется наш чат в Телеграме. Вставь сообщение и отправь. Ответим и подтвердим запись.');
    }
    const d = day();
    const token = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]).join('');
    btn.disabled = true; btn.textContent = 'Отправляем…';
    const body = new URLSearchParams({ event_id: ev.id, event_title: ev.title, time: ev.time, day: d, token,
      name: f.name.value.trim(), phone: f.phone.value.trim(), people: f.people.value, heard: f.heard.value, comment: f.comment.value.trim(),
      source, page: location.href, website: f.website.value });
    let res = { status: 'pending', token };
    try {
      const r = await fetch(REG_ENDPOINT, { method: 'POST', body });
      try { res = await r.json(); } catch (_) {}
    } catch (_) {
      try { await fetch(REG_ENDPOINT, { method: 'POST', mode: 'no-cors', body }); }   // ответ не прочитать, но заявка уйдёт
      catch (__) { btn.disabled = false; refreshSeats(); return fail(`Не получилось отправить. Проверь интернет или напиши в <a class="link" href="${CONTACT_TG}">Телеграм</a>.`); }
    }
    if (res.status === 'closed' || res.status === 'notopen') { btn.disabled = false; refreshSeats(); return fail(esc(res.message || 'Запись на этот день закрыта.')); }
    const text = res.status === 'duplicate' ? `С этим номером уже есть запись на ${fmtDay(d)}. Подтверди её в Телеграме, если ещё не сделал.`
      : res.status === 'waitlist' ? `Мест на ${fmtDay(d)} уже нет, ты в листе ожидания. Подтверди в Телеграме: если место освободится, бот сразу напишет.`
      : `Держим для тебя место на ${fmtDay(d)}. Подтверди его в Телеграме.`;
    confirm(text, `https://t.me/${BOT_USERNAME}?start=${res.token || token}`);
  });
}

/* ---------- команда и человек ---------- */
function teamPage(){
  const team = crewOf('team');
  $('team-lead').textContent = `${people(TEAM_SIZE)}, у каждого своё дело: от дизайна и видео до мероприятий и партнёрств. Нажми на кадр, откроется страница человека.`;
  $('crew').innerHTML = strip(team.map(p => mate(p, false)).join('') + youTile(false), 'Команда');
  [['expert', 'experts'], ['guest', 'guests']].forEach(([role, id]) => {
    const list = crewOf(role);
    if (list.length) $(id).innerHTML = list.map(p => mate(p)).join(''); else $(id + '-sec').hidden = true;
  });
}
// 10.11, Илья: стрелки на соседних участников, ниже лента «Кто ещё в команде», кадры человека в самом низу
function personPage(){
  const p = PEOPLE.find(x => x.id === Q.get('id')), main = $('page');
  if (!p) return notFound(main, 'Такого человека на сайте нет.', 'team.html', 'Вся команда');
  document.title = `${p.name} · вместе`;
  const kind = { team: 'Команда', expert: 'Эксперт', guest: 'Гость встречи' }[p.role] || '';
  const evs = EVENTS.filter(e => (e.people || []).includes(p.id) && !e.hidden);
  const group = p.role === 'team' ? crewOf('team') : [...crewOf('expert'), ...crewOf('guest')];
  const at = group.findIndex(x => x.id === p.id);
  const others = at < 0 ? group : [...group.slice(at + 1), ...group.slice(0, at)];   // лента начинается со следующего
  const prev = at < 0 ? null : group[(at - 1 + group.length) % group.length], next = at < 0 ? null : group[(at + 1) % group.length];
  const href = x => `person.html?id=${encodeURIComponent(x.id)}`;
  const first = x => esc(x.name.split(' ')[0]);
  const sec = (h, body) => `<div class="pp-sec">${h ? `<h2>${h}</h2>` : ''}${body}</div>`;
  const pnav = group.length > 1 && at >= 0 ? `<nav class="pp-nav" aria-label="Соседние страницы">
      <a class="pp-nav__btn" href="${href(prev)}" rel="prev" aria-label="Предыдущий: ${esc(prev.name)}" title="${esc(prev.name)}">${ARROW}</a>
      <span class="pp-nav__n num">${String(at + 1).padStart(2, '0')} / ${String(group.length).padStart(2, '0')}</span>
      <a class="pp-nav__next" href="${href(next)}" rel="next" aria-label="Следующий: ${esc(next.name)}"><span>${first(next)}</span>${ARROW}</a>
    </nav>` : '';
  const moreH = p.role === 'team' ? 'Кто ещё в команде' : 'Ещё эксперты и гости';
  main.innerHTML = `<section class="wrap pp-top">
      ${p.photo ? `<div class="pp-pic pic">${pic(p.photo, p.photoPos, p.name)}</div>` : `<div class="pp-pic tile${hash(p.id) % 2 ? ' m' : ''}"><img src="${silSrc(hash(p.id))}" alt=""></div>`}
      <div>
        <div class="pp-bar"><a class="back" href="team.html">${ARROW}${p.role === 'team' ? 'Вся команда' : 'Все люди'}</a>${pnav}</div>
        <p class="kick" style="margin-bottom:18px">${kind}</p>
        <h1 class="pp-name">${esc(p.name)}</h1>
        ${p.position ? `<p class="lead pp-pos">${esc(p.position)}</p>` : ''}
        ${p.contact ? `<div class="btns pp-cta"><a class="btn" href="${esc(p.contact)}"${ext(p.contact)}>Написать в Телеграм</a></div>` : ''}
        ${p.about ? sec('Коротко', `<div class="prose">${p.about.map(t => `<p>${esc(t)}</p>`).join('')}</div>`) : ''}
        ${p.work ? sec('Чем занимается', `<ul class="ticks">${p.work.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`) : ''}
        ${p.talk ? sec('О чём поговорить', `<div class="prose"><p>${esc(p.talk)}</p></div>`) : ''}
        ${evs.length ? sec('Встречи', evs.map(row).join('')) : ''}
      </div>
    </section>
    ${others.length ? `<section class="sec--tight pp-more"><div class="wrap"><div class="shead"><h2 class="blk__h">${moreH}</h2><a class="more" href="team.html">${p.role === 'team' ? 'Вся команда' : 'Все люди'} ${ARROW}</a></div></div>
      ${others.length >= 6 ? strip(others.map(x => mate(x, false)).join('') + (p.role === 'team' ? youTile(false) : ''), moreH) : `<div class="wrap"><div class="people">${others.map(x => mate(x)).join('')}</div></div>`}</section>` : ''}
    ${p.photos && p.photos.length ? `<section class="sec--tight"><div class="wrap"><h2 class="blk__h" style="margin-bottom:28px">Кадры</h2><div class="gal">${p.photos.map(x => `<figure><img src="${esc(x.src)}" alt="${esc(x.note || '')}" loading="lazy" style="object-position:${esc(x.pos || '50% 50%')}">${x.note ? `<figcaption>${esc(x.note)}</figcaption>` : ''}</figure>`).join('')}</div></div></section>` : ''}`;
  if (pnav) addEventListener('keydown', e => {
    if (typing(e)) return;
    if (e.key === 'ArrowLeft') location.href = href(prev);
    if (e.key === 'ArrowRight') location.href = href(next);
  });
}

/* ---------- блог ---------- */
// 10.11, Илья: рубрики, как форматы в афише (BLOG_CATS в content.js), и сетка по три записи в строке
function blogPage(){
  const posts = postsSorted(), chips = $('blog-chips');
  let c = Q.get('c'); if (!BLOG_CATS.includes(c)) c = null;
  function draw(){
    chips.innerHTML = [null, ...BLOG_CATS].map(t => {
      const n = t ? posts.filter(p => p.cat === t).length : posts.length;
      return `<button class="chip" type="button" data-c="${esc(t || '')}" aria-pressed="${t === c}">${esc(t || 'Все')}<small>${n}</small></button>`;
    }).join('');
    $('posts').innerHTML = postGrid(c ? posts.filter(p => p.cat === c) : posts, c);
    history.replaceState(null, '', c ? `?c=${encodeURIComponent(c)}` : location.pathname);
    reveal();
  }
  chips.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    c = b.dataset.c || null; draw();
  });
  draw();
}
function postPage(){
  const p = POSTS.find(x => x.id === Q.get('id')), main = $('page');
  if (!p) return notFound(main, 'Такой записи нет.', 'blog.html', 'Весь блог');
  document.title = `${p.title} · вместе`;
  const ev = p.event ? eventById(p.event) : null;
  main.innerHTML = `<section class="phead"><div class="wrap"><a class="back" href="blog.html">${ARROW}Весь блог</a><p class="kick">${esc(p.cat || p.kind)} · ${fmtDate(p.date)}</p>
      <h1 class="ev-title">${esc(p.title)}</h1>${p.lead ? `<p class="lead">${esc(p.lead)}</p>` : ''}</div></section>
    ${p.image ? `<div class="wrap"><figure><img src="${esc(p.image)}" alt="${esc(p.imageNote || '')}" style="width:100%;aspect-ratio:16/9;max-height:72svh;object-fit:cover">${p.imageNote ? `<figcaption class="kick" style="margin-top:12px;letter-spacing:.06em">${esc(p.imageNote)}</figcaption>` : ''}</figure></div>` : ''}
    <div class="wrap"><section class="blk"><h2 class="blk__h">Текст</h2><div class="prose">${(p.body || []).map(t => `<p>${esc(t)}</p>`).join('')}
      ${ev ? `<p><a class="more" href="${eventUrl(ev)}">${esc(ev.title)} ${ARROW}</a></p>` : ''}</div></section>
    ${p.photos && p.photos.length ? `<section class="blk"><h2 class="blk__h">Кадры</h2><div class="gal">${p.photos.map(x => `<figure><img src="${esc(x.src)}" alt="${esc(x.note || '')}" loading="lazy">${x.note ? `<figcaption>${esc(x.note)}</figcaption>` : ''}</figure>`).join('')}</div></section>` : ''}</div>`;
}

/* ---------- о нас и партнёрам ---------- */
function aboutPage(){
  $('about-lead').textContent = SITE.about;
  $('story').innerHTML = STORY.map(t => `<li class="rv"><p>${esc(t)}</p></li>`).join('');
  $('princ').innerHTML = PRINCIPLES.map((p, i) => `<li class="rv" style="--d:${(i % 2) * .08}s"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('');
  $('founders').innerHTML = ['platon', 'ilya'].map(id => PEOPLE.find(p => p.id === id)).filter(Boolean).map(p => mate(p)).join('');
}
// 10.11, Илья: страница про разные форматы партнёрства. Форматы подробно, кто уже с нами, пример коллаборации, цифры и как начать.
function partnersPage(){
  const up = upcomingEvents(), tint = ['wine', 'blue', 'green'];
  $('pways').innerHTML = PARTNER_WAYS.map((w, i) => `<li class="pway ${cls(tint[i % 3])} rv"><span class="pway__n fat num">0${i + 1}</span>
    <div><h3 class="pway__t">${w.t}</h3><p>${w.x}</p></div><p class="pway__get"><b>Что получаете</b>${w.get}</p></li>`).join('');
  const ours = PARTNERS.filter(p => p.status === 'partner');
  $('plates').innerHTML = ours.map(p => {
    const inner = `${p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">` : `<b>${esc(p.name)}</b>`}${p.note ? `<small>${esc(p.note)}</small>` : ''}`;
    return p.url ? `<a class="plate rv" href="${esc(p.url)}"${ext(p.url)}>${inner}</a>` : `<div class="plate rv">${inner}</div>`;
  }).join('');
  const collab = eventById('fsl-collab');
  if (collab && !collab.hidden) $('pt-example').innerHTML = `<figure class="rv">${posterHTML(collab)}<figcaption>Пример коллаборации. Friendship/Love и «Вместе» готовят общий проект, подробности в канале.</figcaption></figure>`;
  $('pt-facts').innerHTML = [
    [TEAM_SIZE, `${plural(TEAM_SIZE, 'человек', 'человека', 'человек')} в команде, свои дизайн, видео и соцсети`, 'wine'],
    [FORMATS.length, `${plural(FORMATS.length, 'формат', 'формата', 'форматов')} встреч, от разговора с гостем до вечеров для своих`, 'blue'],
    [up.length, `${plural(up.length, 'встреча', 'встречи', 'встреч')} уже в афише`, 'green'],
  ].map(([n, t, c]) => `<li class="${cls(c)}"><b class="num">${n}</b><span>${t}</span></li>`).join('');
}

function notFound(main, text, href, label){
  main.innerHTML = `<section class="nf"><div>${sil(3)}<h1 class="h-l">Не нашли</h1><p class="lead">${esc(text)}</p><div class="btns"><a class="btn" href="${href}">${label}</a><a class="btn btn--line" href="index.html">На главную</a></div></div></section>`;
}

/* ---------- запуск ---------- */
head();
foot();
({ home, calendar: () => calendar(false), archive: () => calendar(true), formats: formatsPage, event: eventPage, team: teamPage, person: personPage,
   blog: blogPage, post: postPage, about: aboutPage, partners: partnersPage }[PAGE] || (() => {}))();
initStrips();
reveal();
