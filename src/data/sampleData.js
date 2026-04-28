export const SHOWS = [
  { id: 'SH001', title: '봄 신상 원피스 & 블라우스 특가', handle: '@jieun_style', category: "Women's Apparel", subCategory: 'Contemporary', status: 'live',      startTime: '2026-04-28T14:00', endTime: null,              viewerCount: 342, gmv: 1280000 },
  { id: 'SH002', title: '나이키 / 아디다스 운동화 한정세일',  handle: '@sneakers_mkt',    category: 'Shoes',           subCategory: 'Sneakers',      status: 'live',      startTime: '2026-04-28T15:30', endTime: null,              viewerCount: 218, gmv: 870000  },
  { id: 'SH003', title: '명품백 & 지갑 진품보장 특가',       handle: '@luxury_house',    category: 'Bags',            subCategory: 'Luxury Bags',   status: 'scheduled', startTime: '2026-04-28T18:00', endTime: null,              viewerCount: 0,   gmv: 0       },
  { id: 'SH004', title: '어버이날 선물 홈데코 특가',          handle: '@interior_atelier',category: "Men's Apparel",   subCategory: 'Workwear',      status: 'scheduled', startTime: '2026-04-29T12:00', endTime: null,              viewerCount: 0,   gmv: 0       },
  { id: 'SH005', title: '봄 뷰티 스킨케어 라이브',            handle: '@beauty_kr',       category: 'Beauty',          subCategory: 'Skincare',      status: 'scheduled', startTime: '2026-04-29T20:00', endTime: null,              viewerCount: 0,   gmv: 0       },
  { id: 'SH006', title: '빈티지 데님 & 레더 재킷 컬렉션',    handle: '@vintage_closet',  category: "Men's Apparel",   subCategory: 'Vintage',       status: 'done',      startTime: '2026-04-27T20:00', endTime: '2026-04-27T21:45', viewerCount: 512, gmv: 2100000 },
  { id: 'SH007', title: '봄맞이 홈데코 리빙 소품 할인전',     handle: '@interior_atelier',category: "Women's Apparel", subCategory: 'Vintage',       status: 'done',      startTime: '2026-04-27T15:00', endTime: '2026-04-27T17:30', viewerCount: 891, gmv: 3450000 },
  { id: 'SH008', title: '키즈 여름 신상 의류 총집합',          handle: '@babymom_store',   category: 'Kids',            subCategory: 'Girls',         status: 'done',      startTime: '2026-04-26T14:00', endTime: '2026-04-26T15:20', viewerCount: 204, gmv: 640000  },
];

export const HOSTS = [
  { id: 'U001', name: '김지은', handle: '@jieun_style', email: 'jieun@example.com', joinDate: '2024-03-15', showCount: 48, totalGmv: 18500000, status: 'active', penalties: 0, verified: true },
  { id: 'U002', name: '박준혁', handle: '@sneakers_mkt', email: 'junhyuk@example.com', joinDate: '2023-11-02', showCount: 112, totalGmv: 52300000, status: 'active', penalties: 1, verified: true },
  { id: 'U003', name: '이수진', handle: '@luxury_house', email: 'sujin@example.com', joinDate: '2024-01-20', showCount: 35, totalGmv: 31200000, status: 'suspended', penalties: 3, verified: false },
  { id: 'U004', name: '최민준', handle: '@interior_atelier', email: 'minjun@example.com', joinDate: '2023-08-10', showCount: 88, totalGmv: 29700000, status: 'active', penalties: 0, verified: true },
  { id: 'U005', name: '정하나', handle: '@vintage_closet', email: 'hana@example.com', joinDate: '2024-05-01', showCount: 22, totalGmv: 8900000, status: 'active', penalties: 2, verified: false },
];

export const HOST_STATS = [
  { userId: 'U001', handle: '@jieun_style', totalShows: 48, avgViewers: 284, totalGmv: 18500000, avgGmvPerShow: 385417, topCategory: '여성의류', lastShowDate: '2026-04-28' },
  { userId: 'U002', handle: '@sneakers_mkt', totalShows: 112, avgViewers: 521, totalGmv: 52300000, avgGmvPerShow: 467000, topCategory: '신발', lastShowDate: '2026-04-27' },
  { userId: 'U003', handle: '@luxury_house', totalShows: 35, avgViewers: 612, totalGmv: 31200000, avgGmvPerShow: 891429, topCategory: '핸드백', lastShowDate: '2026-04-25' },
  { userId: 'U004', handle: '@interior_atelier', totalShows: 88, avgViewers: 398, totalGmv: 29700000, avgGmvPerShow: 337500, topCategory: '홈/리빙', lastShowDate: '2026-04-27' },
  { userId: 'U005', handle: '@vintage_closet', totalShows: 22, avgViewers: 189, totalGmv: 8900000, avgGmvPerShow: 404545, topCategory: '남성의류', lastShowDate: '2026-04-27' },
];

export const LIVE_CATEGORIES = [
  {
    id: 'LC001', name: "Women's Apparel", contents: 428,
    subs: [
      { id: 'LS001', name: 'Vintage',               contents: 93  },
      { id: 'LS002', name: 'Contemporary',           contents: 112 },
      { id: 'LS003', name: 'Streetwear',             contents: 87  },
      { id: 'LS004', name: 'Activewear (Athleisure)', contents: 76  },
      { id: 'LS005', name: 'Plus Size',              contents: 60  },
    ],
  },
  {
    id: 'LC002', name: 'Bags', contents: 215,
    subs: [
      { id: 'LS006', name: 'Luxury Bags',   contents: 134 },
      { id: 'LS007', name: 'Designer Bags', contents: 81  },
    ],
  },
  {
    id: 'LC003', name: "Men's Apparel", contents: 310,
    subs: [
      { id: 'LS008', name: 'Vintage',       contents: 74  },
      { id: 'LS009', name: 'Streetwear',    contents: 98  },
      { id: 'LS010', name: 'Contemporary',  contents: 88  },
      { id: 'LS011', name: 'Workwear',      contents: 50  },
    ],
  },
  {
    id: 'LC004', name: 'Shoes', contents: 184,
    subs: [
      { id: 'LS012', name: 'Sneakers',      contents: 102 },
      { id: 'LS013', name: 'Heels & Pumps', contents: 45  },
      { id: 'LS014', name: 'Boots',         contents: 37  },
    ],
  },
  {
    id: 'LC005', name: 'Kids', contents: 97,
    subs: [
      { id: 'LS015', name: 'Boys',  contents: 48 },
      { id: 'LS016', name: 'Girls', contents: 49 },
    ],
  },
  {
    id: 'LC006', name: 'Beauty', contents: 143,
    subs: [
      { id: 'LS017', name: 'Skincare', contents: 89 },
      { id: 'LS018', name: 'Makeup',   contents: 54 },
    ],
  },
];

export const BRAND_TAGS = [
  { id: 'BT001', name: 'Adidas',      contents: 142 },
  { id: 'BT002', name: 'Balenciaga',  contents: 38  },
  { id: 'BT003', name: 'Carhartt',    contents: 27  },
  { id: 'BT004', name: 'Chanel',      contents: 91  },
  { id: 'BT005', name: 'Coach',       contents: 54  },
  { id: 'BT006', name: 'Dior',        contents: 47  },
  { id: 'BT007', name: 'Fendi',       contents: 33  },
  { id: 'BT008', name: 'Gucci',       contents: 88  },
  { id: 'BT009', name: 'H&M',         contents: 210 },
  { id: 'BT010', name: 'Jordan',      contents: 176 },
  { id: 'BT011', name: 'Kate Spade',  contents: 62  },
  { id: 'BT012', name: 'Louis Vuitton', contents: 115 },
  { id: 'BT013', name: 'Lululemon',   contents: 94  },
  { id: 'BT014', name: 'Nike',        contents: 231 },
  { id: 'BT015', name: 'Off-White',   contents: 41  },
  { id: 'BT016', name: 'Prada',       contents: 59  },
  { id: 'BT017', name: 'Ralph Lauren', contents: 78 },
  { id: 'BT018', name: 'Saint Laurent', contents: 44 },
  { id: 'BT019', name: 'Tory Burch',  contents: 67  },
  { id: 'BT020', name: 'Under Armour', contents: 53 },
  { id: 'BT021', name: 'Versace',     contents: 29  },
  { id: 'BT022', name: 'Zara',        contents: 188 },
];

export const SALE_TYPES = [
  { id: 'ST001', name: 'None'               },
  { id: 'ST002', name: 'Luxury Price'       },
  { id: 'ST003', name: 'Clearance'          },
  { id: 'ST004', name: 'Budget / Low Price' },
  { id: 'ST005', name: 'Live Flash Sale'    },
  { id: 'ST006', name: 'Auction'            },
];

export const EVENTS = [
  {
    id: 'RCB0', title: '[Trending] Only Alo and LuLu week',
    startDate: '2026-03-23T02:29', endDate: '2026-03-26T02:29',
    sellers: [
      { handle: '@nike_seller', name: 'nike seller' },
      { handle: '@lulu_seller', name: 'lulu seller' },
      { handle: '@alo_seller',  name: 'alo seller' },
    ],
  },
  {
    id: 'CXMC', title: 'K-Beauty Exclusive week (3/30-4/1)',
    startDate: '2026-03-29T20:32', endDate: '2026-03-31T20:32',
    sellers: [
      { handle: '@beauty_kr',  name: 'beauty kr' },
      { handle: '@kbeauty_co', name: 'kbeauty co' },
    ],
  },
  {
    id: 'Y1XS', title: 'NWT Rare Sneakers from Nike',
    startDate: '2026-03-29T20:30', endDate: '2026-04-02T20:30',
    sellers: [
      { handle: '@sneakers_mkt', name: 'sneakers mkt' },
      { handle: '@rare_kicks',   name: 'rare kicks' },
    ],
  },
  {
    id: '0SKT', title: 'Trending Spring Lookbook',
    startDate: '2026-03-23T08:28', endDate: '2026-03-26T20:28',
    sellers: [
      { handle: '@jieun_style',    name: '스타일리스트 지은' },
      { handle: '@vintage_closet', name: '빈티지클로젯' },
    ],
  },
];

export const STATUS_LABELS = {
  live: '진행중',
  scheduled: '예정',
  done: '종료',
  rehearsal: '리허설',
  active: '정상',
  suspended: '정지',
};

export const STATUS_BADGE_CLASS = {
  live: 'badge-live',
  scheduled: 'badge-scheduled',
  done: 'badge-done',
  rehearsal: 'badge-amber',
  active: 'badge-done',
  suspended: 'badge-live',
};
