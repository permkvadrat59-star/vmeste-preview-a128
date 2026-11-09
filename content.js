/* Содержимое сайта «Вместе», кроме афиши (она в events.js).
   Добавить человека, партнёра или статью = добавить объект в нужный список. Вёрстку не трогать.
   Факты пишем только подтверждённые: нет данных — нет строки. */

// Лента над шапкой: короткие фразы из принципов (слова владельца 26.10). Порядок = порядок в ленте.
const TICKER = [
  'Быть самим собой',
  'С нами хоть куда',
  'Помогать, любить, дружить',
  'Создавать и творить',
  'Придумывать и бредогенерить',
  'Приносить что-то своё',
  'Делать, а не казаться',
  'Начинать вместе',
  'Приходить одному, уходить с друзьями',
];

// Визуализации зала (события, блог): false — убраны 26.10, пути в данных остаются. Настоящие фото людей показываются всегда.
const SHOW_PHOTOS = true;
// Готовые ассоциативные кадры в assets/img/people/assoc (обновляется скриптом при генерации)
const ASSOC_FILES = ['design.webp', 'edit.webp', 'video.webp', 'social.webp', 'events.webp', 'texts.webp', 'partners.webp', 'ops.webp', 'marketing.webp', 'creative.webp', 'biz.webp', 'outside.webp', 'host.webp', 'vmeste.webp', 'fashion.webp', 'mountain.webp', 'city.webp', 'psy.webp', 'founder.webp'];   // ИИ-визуализации зала из данных убраны 26.10; теперь фото только настоящие

// Форматы встреч. Какой формат в какой день — объявляем в афише, к дням недели не привязываем.
const FORMATS = [   // 05.11: по новой афише ноября (name = type встречи в events.js)
  { name: 'Разговор с гостем', text: 'Предприниматели и люди, которые сделали своё дело в Перми. Вопросы собираем заранее, дальше живой разговор, зал тоже спрашивает.', color: 'green' },
  { name: 'Тренинг', text: 'Три-четыре часа практики в кругу с психологами. Тему выбираем по запросу группы.', color: 'blue' },
  { name: 'Лекторий', text: 'Короткая лекция и сразу практика, в один вечер.', color: 'ink' },
  { name: 'Мастер-классы', text: 'Пробуем руками: тату, ювелирка, фото. Несколько станций в один день.', color: 'wine' },
  { name: 'Вечер для своих', text: 'Кино на кирпичной стене, концерты, дропы пермских брендов. Просто время вместе.', color: 'wine' },
  { name: 'Открытые двери', text: 'Можно зайти без записи, посмотреть зал и познакомиться с командой.', color: 'blue' },
];

// Люди. role: 'team' — команда, 'expert' — эксперт, 'guest' — гость встречи.
// Команда — список владельца от 26.10; роли из «Структура команды, вер. 3 от 20.10» (главная функция). Нет в документе = пусто.
// assoc — ассоциативный кадр по роли (сгенерирован, без людей): идёт в мозаику и фон страницы, пока нет своего фото.
// Страница человека берёт: about (абзацы), work (список дел во «Вместе»), talk (о чём поговорить), contact, since,
// photos: [{src, note, pos}] — кадры человека (pos — точка фото, которую держим при обрезке); photo/photoPos — портрет для карточки.
const PEOPLE = [
  {
    id: 'platon', role: 'team', name: 'Платон Трутнев', position: 'Основатель, партнёрства и сообщество', bg: 'assets/img/people/assoc/founder.webp',
    photo: 'assets/img/people/platon/p03.webp', photoPos: '50% 45%',   // pos — какую точку фото держать в кадре при обрезке
    photos: [   // кадры человека без деления; первый — портрет из карточки добавляется сам
      { src: 'assets/img/people/platon/p01.webp', note: 'Офис', pos: '50% 60%' },
      { src: 'assets/img/people/platon/p02.webp', note: 'Лес', pos: '65% 55%' },
      { src: 'assets/img/people/platon/p04.webp', note: 'Мост', pos: '50% 25%' },
      { src: 'assets/img/people/platon/p05.webp', note: 'Зима', pos: '55% 45%' },
      { src: 'assets/img/people/platon/p06.webp', note: 'Сноуборд', pos: '60% 50%' },
    ],
    about: ['Отвечает за запуск движения, партнёрства и пространство на Ленина, 44. Собирает вокруг «Вместе» людей, партнёров и первые форматы.'],
    talk: 'Запуск сообщества, поиск партнёров, первые шаги проекта и работа с неопределённостью.',
    contact: 'https://t.me/Paltus10'
  },
  {
    id: 'ilya', role: 'team', name: 'Илья Амиров', position: 'Основатель, операционное управление', bg: 'assets/img/people/assoc/ops.webp',
    photo: 'assets/img/w/ilya.webp', photoPos: '50% 12%',
    about: ['Ведёт студию DAPI и помогает превращать идеи «Вместе» в продукты, кейсы и задачи для команды.'],
    talk: 'Продуктовое мышление, сбор команды, постановка задач и переход от идеи к первому результату.',
    contact: 'https://t.me/amirov_il'   // через Илью вступают в команду
  },
  { id: 'roman', role: 'team', photo: 'assets/img/people/team/roman.webp', photoPos: '44% 25%', assoc: 'assets/img/people/assoc/outside.webp', position: 'Внешние мероприятия', name: 'Роман Гильмутдинов' },
  { id: 'tatyana', role: 'team', photo: 'assets/img/people/team/tatyana.webp', photoPos: '50% 35%', assoc: 'assets/img/people/assoc/design.webp', position: 'Дизайн', name: 'Татьяна' },
  { id: 'polina', role: 'team', photo: 'assets/img/people/team/polina.webp', photoPos: '40% 28%', assoc: 'assets/img/people/assoc/social.webp', position: 'Соцсети', name: 'Полина' },
  { id: 'agata', role: 'team', photo: 'assets/img/people/team/agata.webp', photoPos: '42% 26%', assoc: 'assets/img/people/assoc/social.webp', position: 'Соцсети', name: 'Агата' },
  { id: 'dmitry-predein', role: 'team', photo: 'assets/img/people/team/dmitry-predein.webp', photoPos: '50% 30%', assoc: 'assets/img/people/assoc/vmeste.webp', name: 'Дмитрий Предеин', position: '' },
  { id: 'irina', role: 'team', photo: 'assets/img/people/team/irina.webp', photoPos: '61% 34%', assoc: 'assets/img/people/assoc/edit.webp', position: 'Видеомонтаж и дизайн', name: 'Ирина' },
  { id: 'arina', role: 'team', photo: 'assets/img/people/team/arina.webp', photoPos: '52% 26%', assoc: 'assets/img/people/assoc/events.webp', position: 'Мероприятия, маркетинг и медиа', name: 'Арина Максимова' },
  { id: 'ekaterina', role: 'team', photo: 'assets/img/people/team/ekaterina.webp', photoPos: '41% 44%', assoc: 'assets/img/people/assoc/video.webp', position: 'Видеопроизводство', name: 'Екатерина' },
  { id: 'kirill', role: 'team', photo: 'assets/img/people/team/kirill.webp', photoPos: '50% 35%', assoc: 'assets/img/people/assoc/edit.webp', position: 'Видеомонтаж', name: 'Кирилл Богданов' },
  { id: 'eva', role: 'team', photo: 'assets/img/people/team/eva.webp', photoPos: '50% 45%', assoc: 'assets/img/people/assoc/creative.webp', position: 'Мероприятия и креатив', name: 'Ева Коскова' },
  { id: 'vika', role: 'team', photo: 'assets/img/people/team/vika.webp', photoPos: '50% 30%', assoc: 'assets/img/people/assoc/partners.webp', position: 'Партнёрства и привлечение', name: 'Вика' },
  { id: 'ksyusha', role: 'team', photo: 'assets/img/people/team/ksyusha.webp', photoPos: '70% 40%', assoc: 'assets/img/people/assoc/texts.webp', position: 'Тексты и соцсети', name: 'Ксюша' },
  { id: 'dmitry-bazuev', role: 'team', photo: 'assets/img/people/team/dmitry-bazuev.webp', photoPos: '50% 40%', assoc: 'assets/img/people/assoc/vmeste.webp', name: 'Дмитрий Базуев', position: '' },
  { id: 'adelina', role: 'team', name: 'Аделина Гросс', position: 'Операционное управление, арт-терапия', bg: 'assets/img/people/assoc/creative.webp',
    photo: 'assets/img/people/team/adelina.webp', photoPos: '52% 24%',   // прислала команда 28.10
    photos: [{ src: 'assets/img/people/adelina.webp', note: 'Портрет', pos: '50% 18%' }],
    about: ['Ведёт арт-терапию во «Вместе». Художественное образование, студентка ВШЭ по направлению «Менеджмент в креативных индустриях», параллельно учится психотерапии.'],
    talk: 'Арт-терапия, творчество как способ разобраться в себе, учёба и своё дело параллельно.' },
  { id: 'vlada', role: 'team', photo: 'assets/img/people/team/vlada.webp', photoPos: '45% 33%', assoc: 'assets/img/people/assoc/host.webp', position: 'Лицо основного аккаунта', name: 'Влада' },
  { id: 'angelina', role: 'team', photo: 'assets/img/people/team/angelina.webp', photoPos: '48% 46%', assoc: 'assets/img/people/assoc/biz.webp', position: 'Бизнес-проекты', name: 'Ангелина' },
  { id: 'alexey', role: 'team', assoc: 'assets/img/people/assoc/marketing.webp', position: 'Маркетинг и медиа', name: 'Алексей' },
  { id: 'anya', role: 'team', assoc: 'assets/img/people/assoc/marketing.webp', position: 'Маркетинг и медиа', name: 'Аня' },
  // Эксперты и гости встреч — по открытым источникам (26.10): проверить с ними перед публикацией, фото запросить.
  { id: 'oshchepkov', hidden: true, role: 'expert', name: 'Олег Ощепков', position: 'Предприниматель, ресторатор, профессор ВШЭ в Перми', bg: 'assets/img/people/assoc/city.webp',
    photo: 'assets/img/people/oshchepkov.webp', photoPos: '50% 25%',   // фото НИУ ВШЭ в Перми (новость 22.04.2025)
    photos: [{ src: 'assets/img/people/oshchepkov-2.webp', note: 'Фото: Максим Кимерлинг, «Коммерсантъ»', pos: '50% 30%' }],
    about: ['Предприниматель с 1997 года: больше 25 лет был основателем и генеральным директором маркетингового агентства «ОЗОН Групп», с 2015 года — ресторатор (кафе «Улитка», «Маркс», «Вехотка»). В 2005–2008 годах — министр культуры Пермского края.',
            'С 2024 года в НИУ ВШЭ в Перми: профессор департамента менеджмента, научный руководитель программы «Менеджмент в креативных индустриях». Окончил Пермский политехнический университет.'],
    talk: 'Как делать проекты в городе, креативные индустрии, рестораны, маркетинг и почему стоит начинать в Перми.' },
  { id: 'baranov', role: 'expert', name: 'Николай Баранов', position: 'Клинический психолог, системный терапевт', bg: 'assets/img/people/assoc/psy.webp',
    photo: 'assets/img/people/baranov.webp',
    about: ['Работает с зависимостями, отношениями и семейной системой; много лет консультирует пары. Ученик Юрия Вагина. Ведёт канал @psy_baranov: о расставаниях, доверии, ссорах и о том, что исцеляет не техника, а другой человек рядом.'],
    talk: 'Отношения, семья, зависимости, как не терять себя рядом с другими.', contact: 'https://t.me/psy_baranov' },
  { id: 'sotnikov', role: 'expert', name: 'Александр Сотников', position: 'Бизнес-психолог и предприниматель', bg: 'assets/img/people/assoc/psy.webp',
    photo: 'assets/img/people/sotnikov.webp',
    about: ['Работает в гештальт-подходе с собственниками и первыми лицами компаний: конфиденциально, без оценок, через глубокий диалог. Ведёт канал @founder_zen о решениях, контроле, выгорании и «карме предпринимателя».'],
    talk: 'Решения под давлением, контроль и страхи, выгорание, терапия как остановка.', contact: 'https://t.me/founder_zen' },
  { id: 'besfamilnaya', hidden: true, role: 'guest', name: 'Яна Бесфамильная', position: 'Дизайнер одежды, бренд YANA BESFAMILNAYA', bg: 'assets/img/people/assoc/fashion.webp',
    photo: 'assets/img/people/besfamilnaya.webp', photoPos: '28% 25%',
    // 27.10: только кадры с самой Яной (показы с моделями убраны в _originals). Пресс-фото, заменить на присланные ею.
    photos: [
      { src: 'assets/img/people/besfamilnaya/01.webp', note: 'Съёмка для «Сноба», фото Алисы Калипсо', pos: '50% 18%' },
      { src: 'assets/img/people/besfamilnaya/02.webp', note: 'Съёмка для «Сноба», фото Алисы Калипсо', pos: '50% 12%' },
      { src: 'assets/img/people/besfamilnaya/03.webp', note: 'Фото: sobaka.ru', pos: '50% 30%' },
    ],
    about: ['Пермский дизайнер, основательница бренда YANA BESFAMILNAYA. Коллекции показываются на Московской неделе моды, эксперт программы «Модный приговор». В основе бренда — идея трансформации и отказ от натурального меха и кожи.'],
    talk: 'Как запустить свой бренд из Перми, мода как бизнес, путь дизайнера.' },
  { id: 'guryanov', role: 'guest', name: 'Данил Гурьянов', position: 'Креативный продюсер, сооснователь ДК, фронтмен The Hard Lux', bg: 'assets/img/people/assoc/host.webp',
    photo: 'assets/img/people/guryanov.webp', photoPos: '62% 40%',   // кадр от владельца 28.10 (ч/б, в машине)
    about: ['Креативный продюсер, сооснователь ДК, фронтмен группы The Hard Lux. Подробнее расскажет на встрече.'],
    talk: 'Как делать площадки, контент и музыку в Перми.', contact: 'https://www.instagram.com/danil_guryanov' },
  { id: 'didebashvili', hidden: true, role: 'guest', name: 'Заза Дидебашвили', position: 'Парк Горького, курорт «Губаха», лига «Конфликт»', bg: 'assets/img/people/assoc/mountain.webp',
    photo: 'assets/img/people/didebashvili.webp', photoPos: '50% 35%',
    photos: [{ src: 'assets/img/people/didebashvili-ring.webp', note: 'На ринге лиги «Конфликт», в центре', pos: '50% 30%' }],
    about: ['Предприниматель: Парк Горького, всесезонный курорт «Губаха», кулачная лига «Конфликт». Подробнее расскажет на встрече.'],
    talk: 'Свой путь в бизнесе, первые шаги и ошибки.' },
];

// Партнёры. status: 'partner' — подтверждённое сотрудничество, только такие выводятся на сайт (28.10, решение владельца); 'talks' — в переговорах, хранятся здесь, не показываются.
const PARTNERS = [
  // 26.10: список владельца «навскидку», с кем есть договорённости. Логотипы (logo) подставить, когда появятся; без логотипа — плашка с названием.
  { name: 'Деловая Россия, Пермское отделение', logo: 'assets/logos/deloros_original.png', url: 'https://deloros.ru', status: 'partner', note: 'Встречи с предпринимателями' },
  // 10.11: Илья, «с нами ещё Friendship/Love и Жизньмарт». Логотипов пока нет, выводятся названием
  { name: 'Friendship/Love', logo: '', url: 'https://t.me/fshiplove', status: 'partner', note: 'Пермский бренд уличной одежды, коллаборация' },
  { name: 'Жизньмарт', logo: '', url: '', status: 'partner', note: 'Сеть магазинов' },
  { name: 'Частная филармония «Триумф»', logo: '', url: 'https://triumphmusic.ru', status: 'talks', note: 'Соседи по Ленина, 44' },
  { name: 'Monkey Grinder', logo: 'assets/logos/monkey-grinder.png', url: 'https://monkey-grinder.ru', status: 'talks', note: 'Кофейни' },
  { name: 'Red Cup', logo: '', url: '', status: 'talks', note: 'Кофейня' },
  { name: 'Дринкит', logo: 'assets/logos/drinkit.svg', url: 'https://drinkit.ru', status: 'talks', note: 'Кофейни' },
  { name: 'Курорт «Губаха»', logo: '', url: '', status: 'talks', note: 'Горнолыжный курорт' },
  { name: 'Йога-клуб', logo: '', url: '', status: 'talks', note: 'Название уточняется' },
  { name: 'Студия звука «Ленком»', logo: '', url: '', status: 'talks', note: 'Звук и запись' },
  { name: 'Даниил Снег', logo: '', url: '', status: 'talks', note: 'Личный бренд' },
];

// Блог: отчёты о прошедших встречах и новости. Свежие сверху (по date).
// cat — рубрика из BLOG_CATS (фильтр на странице блога); kind — 'Отчёт' (про прошедшую встречу) или 'Новость'; event — id из events.js, если запись про встречу;
// image — обложка (широкий кадр), photos — кадры внутри записи [{src, note}], body — абзацы.
const BLOG_CATS = ['Наш путь', 'Мероприятия', 'Спикеры', 'Команда'];   // 10.11: рубрики блога по просьбе Ильи, порядок = порядок кнопок
const POSTS = [
  // Первая запись (28.10): как собирали зал. Факты — слова владельца, фото настоящие (13.10 и 20.10).
  {
    id: 'zal', cat: 'Наш путь', kind: 'Новость', date: '2026-10-20', title: 'Как мы собирали зал',
    lead: 'Зал на Ленина, 44, второй этаж. В октябре красили стены, чинили мебель и стелили ковёр сами, вместе с теми, кто пришёл помочь.',
    image: 'assets/img/hall-now.webp', imageNote: 'Зал 20 октября: стены покрашены, мебель на местах',
    body: ['Сначала были голые кирпичные стены, балки под потолком и высокие окна. Потом появились столы, стулья и зелёный диван, ковёр и картина на стене.',
           'Дальше — первые встречи. Афиша ноября уже на сайте, даты появятся в канале.'],
    photos: [
      { src: 'assets/img/wall/hall-oct.webp', note: '13 октября: ремонт, стулья на столах' },
      { src: 'assets/img/wall/hall-beams.webp', note: 'Балки под потолком' },
      { src: 'assets/img/wall/hall-side.webp', note: 'Стена с подсветкой' },
      { src: 'assets/img/wall/hall-now.webp', note: '20 октября: мебель на местах' },
    ],
  },
];

// Герой на главной (28.10, идея владельца): кирпичная стена, на ней мелкие кадры «как мы начали», в центре картина
// с надписью, которая свисает ниже края стены. Картину заменим на присланную владельцем (frame.image), пока — надпись.
// photos: кадры на стене; x/y — в процентах от стены, rot — наклон, w — ширина в % стены.
const HERO = {
  wall: 'assets/img/brick-wall.webp',
  photos: [],   // 28.10: кадры со стены убраны, владелец пришлёт, что и как развесить
  // надпись «ВМЕСТЕ» баллончиком прямо на стене (28.10: багет убран по просьбе владельца; картина с багетом — assets/img/painting.png, вернуть: image: 'assets/img/painting.png', spray: false)
  // 28.10: пока пусто — просто белая стена (владелец пришлёт, что повесить). Надпись: image: 'assets/img/spray.png', spray: true; картина: image: 'assets/img/painting.png'
  frame: {},
  pins: 3,   // 05.11: сколько ближайших встреч висит на стене (0 = пустая стена)
  note: 'Ленина, 44, дом Ч. Заходи',   // надпись мелом в углу стены
  actions: [],   // 28.10: кнопок под картиной нет (решение владельца)
};

const SITE = {
  slogan: 'Зачем быть одному, если можно быть вместе?',
  about: 'Молодёжное движение в Перми. Своё пространство в центре города, встречи каждую неделю, вход бесплатный.',   // 10.11: «не свой зал, а своё пространство» (Илья)
  teamSize: 25,   // 10.11: столько в команде по словам Ильи; карточки на сайте пока не у всех
  address: 'Пермь, ул. Ленина, 44',
  building: 'Дом Ч, второй этаж',
  entrance: 'Дом Ч, второй этаж. Вход через арку с улицы Ленина',
  // Схема пути от улицы до двери (прислал владелец 05.11): обрезанная для страницы и целиком для просмотра
  routeImage: 'assets/img/kak-nayti.webp',
  routeImageFull: 'assets/img/kak-nayti-full.webp',
  // Как дойти, по схеме владельца
  route: [
    'Заходи в арку дома Ленина, 44 с улицы Ленина.',
    'Иди прямо во двор. У кирпичного дома с деревянными воротами поверни направо.',
    'Дом Ч в конце двора: поднимайся по лестнице на второй этаж.',
  ],
  // Яндекс-карта (виджет по адресу). Видео «как нас найти»: ссылка на .mp4 или код вставки (YouTube/VK/Rutube), пусто = плашка.
  // Яндекс-виджет по координатам с меткой (поиск по тексту метку не ставил): 58.012615, 56.244163 — Ленина, 44 (здание филармонии «Триумф»)
  mapUrl: 'https://yandex.ru/map-widget/v1/?ll=56.244163%2C58.012615&pt=56.244163%2C58.012615%2Cpm2rdm&z=17&l=map',
  howToFindVideo: '',
  // 05.11: вместо виджета (в нём показывалась реклама) — статичная карта Яндекса, по клику открываются Яндекс Карты
  mapImage: 'assets/img/map-static.webp',
  mapLink: 'https://yandex.ru/maps/?pt=56.244163,58.012615&z=17&l=map',
  telegram: 'https://t.me/Paltus10',          // личка Платона
  channel: 'https://t.me/v_meste_perm',       // канал: анонсы
  instagram: 'https://www.instagram.com/vmeste.prm',
};

// Принципы и история — переписаны 28.10 (владелец: «перепиши»); проверить с Платоном.
const PRINCIPLES = [
  { title: 'Приноси своё', text: 'Вещь, книгу, идею, умение или час времени. Зал собран из того, что принесли люди.' },
  { title: 'Ничьё, значит общее', text: '«Вместе» не работает на одного человека или одну организацию.' },
  { title: 'Дело вместо статуса', text: 'Здесь не спрашивают, кто ты по должности. Спрашивают, что ты сделал и что готов сделать.' },
  { title: 'Первый шаг вместе', text: 'Начать одному страшно. Поэтому первый шаг делаем вместе, а дальше каждый растёт через общее дело.' },
];

// Как начиналось (блок на «О нас»)
const STORY = [
  'Нас было двое: Платон и Илья. Разговоры о том, почему в Перми трудно найти своих, кончились простым решением. Нужно место, куда можно прийти без приглашения.',
  'Нашли зал на Ленина, 44, второй этаж. Осенью красили стены, чинили мебель и стелили ковёр сами, вместе с теми, кто пришёл помочь.',
  'Потом собралась команда: двадцать человек, у каждого своё дело, от дизайна до партнёрств. Первые гости согласились прийти ещё до открытия. Первые встречи — в ноябре.',
];
