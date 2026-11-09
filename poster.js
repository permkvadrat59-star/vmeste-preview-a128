/* Постеры афиши, перенесены с основного сайта (site.js, копия main на 05.11) без изменения логики.
   У каждой встречи в events.js poster: { variant, color, title ('|' = перенос), kicker, sub, photo, pos, raw }.
   esc берётся из vm.js (подключается следом), свои здесь только pad2 и photo. */

const pad2 = n => String(n).padStart(2, '0');
const photo = src => (typeof SHOW_PHOTOS !== 'undefined' && SHOW_PHOTOS && src) ? src : '';

const POSTER_VARIANTS = ['paper', 'duo', 'night', 'acid', 'frame', 'stars', 'white', 'circle', 'swiss', 'numeral', 'strips', 'boxes', 'riso', 'vertical', 'type', 'collage', 'mperm', 'lookbook', 'full'];
// Заголовок: базовый размер и ширина колонки по композициям (cqw), чтобы длинное слово («Бесфамильная») ужалось, а не обрезалось
const POSTER_FIT = { paper: [9, 44], duo: [10, 36], night: [10.5, 64], acid: [12.5, 72], frame: [8.5, 42], stars: [9.5, 47], white: [11, 56], circle: [9, 62], swiss: [9, 46], numeral: [7.5, 50], strips: [12, 80], boxes: [9, 70], riso: [11, 60], vertical: [11, 70], type: [10.5, 80], collage: [11, 46], mperm: [10, 50], lookbook: [8.5, 60], full: [10, 62] };
function posterData(ev){
  const p = ev.poster || {};
  const guests = (ev.people || []).map(id => PEOPLE.find(x => x.id === id)).filter(Boolean);
  const guest = guests[0];
  const d = nextDate(ev) || ev.dates[ev.dates.length - 1];
  const own = p.photo || (guest && guest.photo) || ev.image;
  return {
    variant: POSTER_VARIANTS.includes(p.variant) ? p.variant : POSTER_VARIANTS[[...ev.id].reduce((a, c) => a + c.charCodeAt(0), 0) % POSTER_VARIANTS.length],
    color: p.color || ev.color || 'wine',
    photo: photo(own),
    pos: p.pos || (p.photo ? '' : guest && guest.photo ? guest.photoPos : ev.imagePos) || '50% 50%',
    kicker: p.kicker || ev.type || 'Встреча',
    title: p.title || ev.title,
    sub: p.sub || (guest ? guest.position : ev.text),
    when: whenLine(ev) || MONTHS_NOM[parseDay(d).getMonth()],
    num: dateKnown(ev) ? `${pad2(parseDay(d).getDate())}.${pad2(parseDay(d).getMonth() + 1)}` : MONTHS_NOM[parseDay(d).getMonth()],
    place: ev.place || 'Ленина, 44',
    guests,
    raw: !!p.raw,
  };
}
const POSTER_STARS = `<svg class="poster__stars" viewBox="0 0 60 34" aria-hidden="true" preserveAspectRatio="none">
  <path d="M12 15 L13.8 20.6 L19.5 22.5 L13.8 24.4 L12 30 L10.2 24.4 L4.5 22.5 L10.2 20.6 Z"/>
  <path d="M3 2 L3.9 5 L7 6 L3.9 7 L3 10 L2.1 7 L-1 6 L2.1 5 Z"/>
  <path d="M6 12 L6.6 13.8 L8.5 14.4 L6.6 15 L6 16.8 L5.4 15 L3.5 14.4 L5.4 13.8 Z"/>
  <path d="M56 19 L56.8 21.4 L59.2 22.2 L56.8 23 L56 25.4 L55.2 23 L52.8 22.2 L55.2 21.4 Z"/>
</svg>`;
// Обводка от руки вокруг человека в центре кадра (Заза на ринге): два неровных овала
const POSTER_RING = `<svg class="poster__ring" viewBox="0 0 160 90" aria-hidden="true" preserveAspectRatio="none">
  <path d="M80 5 C 96 4, 98 24, 96 36 C 94 50, 87 58, 78 57.5 C 66 57, 62 45, 63 31 C 64 16, 69 5.5, 80 5 Z"/>
  <path d="M81.5 8 C 94 8, 95.5 25, 93.5 36 C 91.5 48, 86 55, 78.5 54.5 C 68.5 54, 65 44, 66 31 C 67 18, 71 8.5, 81.5 8" style="stroke-width:.45"/>
</svg>`;
function posterHTML(ev, { link = true } = {}){
  const x = posterData(ev);
  const img = (src, pos, extra = '') => `<img src="${src}" alt="" loading="lazy" style="object-position:${pos}"${extra}>`;
  const ph = x.photo ? `<div class="poster__ph">${img(x.photo, x.pos)}</div>` : '';
  const lines = x.title.split(/\s*\|\s*/), longest = Math.max(...lines.map(l => l.length)) + (x.variant === 'acid' ? 1 : 0);
  const [base, width] = POSTER_FIT[x.variant], lower = x.variant === 'duo' || x.variant === 'stars';
  const size = Math.min(base, width / ((lower ? .5 : .54) * longest)).toFixed(2);   // ширина знака Oswald
  const title = `<h3 class="poster__title" style="--ts:${size}cqw">${lines.map(esc).join('<br>')}${x.variant === 'acid' ? '.' : ''}</h3>`;
  // цифры даты (или слово месяца, пока даты нет): ужимаются по длине, чтобы не лезть на кадр
  const numSize = Math.min(26, 50 / (0.56 * x.num.length)).toFixed(1);
  const marq = () => `<p class="poster__marq" aria-hidden="true">${`<span>${esc(x.kicker)}</span><span>Вместе</span><span>${esc(x.place)}</span>`.repeat(6)}</p>`;
  const k = text => `<p class="poster__k">${text}</p>`;
  const meta = text => `<p class="poster__meta">${esc(text)}</p>`;
  const foot = (...parts) => `<div class="poster__foot">${parts.join('')}</div>`;
  // штамп «Вместе» — наклейка: кремовая плашка с чёрным словом, читается на любом фоне
  const stamp = `<span class="poster__stamp"><img src="assets/brand/wordmark-ink.svg" alt="Вместе"></span>`;
  // Swiss: два ведущих — два портрета с подписями вместо одного кадра
  const faces = x.guests.length > 1
    ? `<div class="poster__faces">${x.guests.slice(0, 3).map(g => `<div class="poster__face">${g.photo ? img(g.photo, g.photoPos || '50% 30%') : ''}<small><b>${esc(g.name)}</b><span>${esc(g.position || '')}</span></small></div>`).join('')}</div>`
    : ph;
  const grid = `<div class="poster__grid"><span><b>Формат</b>${esc(x.kicker)}</span><span><b>Когда</b>${esc(x.when)}</span><span><b>Где</b>${esc(x.place)}</span></div>`;
  const body = {
    paper:  `${ph}${k(esc(x.kicker))}${title}${foot(meta(x.sub), `<p class="poster__big">${esc(x.when)}</p>`)}${stamp}`,
    duo:    `${ph}${title}${foot(k(`${esc(x.kicker)}<br>${esc(x.when)}`), meta(x.sub))}${stamp}`,
    night:  `${ph}${marq()}${marq()}${title}${k(`${esc(x.when)}<br>${esc(x.place)}`)}${stamp}`,
    acid:   `${ph}<span class="poster__sq poster__sq--tl"></span><span class="poster__sq poster__sq--bl"></span>${k(`${esc(x.kicker)}<br>${esc(x.place)}`)}${title}<p class="poster__big">${esc(x.when)}</p>${stamp}`,
    frame:  `${ph}${k(`<span>${esc(x.kicker)}</span><span>${esc(x.when)}</span>`)}${foot(title, meta(x.sub))}${stamp}`,
    stars:  `${ph}${POSTER_STARS}${k(`${esc(x.kicker)}<br>${esc(x.when)}`)}${title}${meta(x.sub)}${stamp}`,
    white:  `${ph}${k(`${esc(x.kicker)}`)}${meta(x.sub)}<p class="poster__big">${esc(x.when)}</p>${title}${stamp}`,
    // во весь постер: кадр в цвете, подпись сверху слева, название внизу на затемнении
    full:   `${ph}${k(`${esc(x.kicker)}<br>${esc(x.when)}, ${esc(x.place)}`)}${title}${stamp}`,
    circle: `${ph}${POSTER_RING}${k(`${esc(x.kicker)}<br>${esc(x.when)}, ${esc(x.place)}`)}${title}${stamp}`,
    numeral: `${ph}${k(esc(x.kicker))}<p class="poster__num" style="--ns:${numSize}cqw">${esc(x.num)}</p>${foot(title, meta(x.sub))}${stamp}`,
    strips: `${[0, 1, 2].map(i => `<div class="poster__ph poster__strip" style="left:${i * 34}cqw">${x.photo ? `<img src="${x.photo}" alt="" loading="lazy" style="object-position:${x.pos};margin-left:${-i * 34}cqw">` : ''}</div>`).join('')}${k(`${esc(x.kicker)}<br>${esc(x.when)}`)}${title}${meta(x.sub)}${stamp}`,
    boxes:  `${ph}<h3 class="poster__title poster__boxes" style="--ts:${size}cqw">${lines.map(l => `<span>${esc(l)}</span>`).join('')}</h3>${k(`${esc(x.kicker)}<br>${esc(x.when)}, ${esc(x.place)}`)}${meta(x.sub)}${stamp}`,
    riso:   `${ph}${k(`${esc(x.kicker)}<br>${esc(x.when)}`)}${title}${meta(x.sub)}${stamp}`,
    vertical: `${ph}<p class="poster__vert">${esc(x.kicker)}</p><p class="poster__box">${esc(x.when)}</p>${title}${meta(x.sub)}${stamp}`,
    collage: `${ph}${k(`${esc(x.kicker)}<br>${esc(x.when)}, ${esc(x.place)}`)}${title}${meta(x.sub)}${stamp}`,
    // «мпермь»: в стиле их карточек — чёрное поле, жёлтые плашки-«стикеры», моноширинный текст
    mperm:  `${ph}<p class="poster__k">${esc(x.kicker)}</p>${title}<p class="poster__tag">${esc(x.when)}, ${esc(x.place)}</p>${meta(x.sub)}${stamp}`,
    // лукбук: кадры во всю верхнюю часть, под ними чёрная полоса с названием — визуал не перекрыт
    lookbook: `${ph}<div class="poster__band"><div>${k(esc(x.kicker))}${title}</div><div class="poster__band-r">${meta(`${x.when}, ${x.place}`)}${meta(x.sub)}</div></div>${stamp}`,
    type:   `${k(esc(x.kicker))}<p class="poster__big">${esc(x.when)}</p>${title}${meta(x.sub)}${stamp}`,
    swiss:  `${faces}${k(esc(x.guests.length > 1 ? 'Ведут ' + x.guests.map(g => g.name.split(' ')[0]).join(' и ') : x.kicker))}${title}${grid}${stamp}`,
  }[x.variant];
  const tag = link ? 'a' : 'div';
  return `<${tag} class="poster p-${x.variant} ${x.color} grain${x.raw ? ' poster--raw' : ''}"${link ? ` href="${eventUrl(ev)}" aria-label="${esc(ev.title)}"` : ''}>${body}</${tag}>`;
}

// Постер-заглушка в конце ленты: «следующая встреча появится здесь», ведёт в канал (анонсы выходят там первыми)
function nextTeaserHTML(){
  return `<a class="poster p-teaser blue grain" href="${SITE.channel}" target="_blank" rel="noopener" aria-label="Следующая встреча: следи за каналом">
    <div class="poster__ph"><img src="assets/img/events/next-chairs.webp" alt="" loading="lazy" style="object-position:50% 50%"></div>
    <p class="poster__k">Следующая встреча</p>
    <h3 class="poster__title">Завтра здесь<br>может появиться<br>новое событие</h3>
    <p class="poster__meta">Анонсы выходят сначала в канале. Подпишись, чтобы не пропустить.</p>
    <span class="btn btn--sm poster__btn">Канал в Телеграме</span>
  </a>`;
}

// Мозаика как на странице афиши основного сайта: по три (большой постер и два малых, стороны чередуются).
// Нечётное число закрывает постер-заглушка, если teaser не выключен.
function posterMosaic(list, { teaser = true } = {}){
  const cards = list.map(ev => posterHTML(ev));
  if (teaser && cards.length % 2) cards.push(nextTeaserHTML());
  const groups = [];
  for (let n = 0; n < cards.length; n += 3) { const g = cards.slice(n, n + 3); groups.push(`<div class="afisha-group afisha-group--${g.length}">${g.join('')}</div>`); }
  return `<div class="afisha-mosaic">${groups.join('')}</div>`;
}
