export const SHOWS = [
  { id: 'SH001', title: '봄 신상 원피스 & 블라우스 특가', seller: '스타일리스트_지은', handle: '@jieun_style', category: '여성의류', status: 'live', startTime: '2026-04-28T14:00', endTime: null, viewerCount: 342, gmv: 1280000 },
  { id: 'SH002', title: '나이키 / 아디다스 운동화 한정세일', seller: '스니커즈마켓', handle: '@sneakers_mkt', category: '신발', status: 'scheduled', startTime: '2026-04-28T18:00', endTime: null, viewerCount: 0, gmv: 0 },
  { id: 'SH003', title: '명품백 & 지갑 진품보장 특가', seller: '럭셔리하우스', handle: '@luxury_house', category: '핸드백', status: 'scheduled', startTime: '2026-04-29T12:00', endTime: null, viewerCount: 0, gmv: 0 },
  { id: 'SH004', title: '봄맞이 홈데코 리빙 소품 할인전', seller: '인테리어공방', handle: '@interior_atelier', category: '홈/리빙', status: 'done', startTime: '2026-04-27T15:00', endTime: '2026-04-27T17:30', viewerCount: 891, gmv: 3450000 },
  { id: 'SH005', title: '빈티지 데님 & 레더 재킷 컬렉션', seller: '빈티지클로젯', handle: '@vintage_closet', category: '남성의류', status: 'done', startTime: '2026-04-27T20:00', endTime: '2026-04-27T21:45', viewerCount: 512, gmv: 2100000 },
  { id: 'SH006', title: '키즈 여름 신상 의류 총집합', seller: '베이비맘스토어', handle: '@babymom_store', category: '키즈', status: 'rehearsal', startTime: '2026-04-28T16:00', endTime: null, viewerCount: 0, gmv: 0 },
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

export const CATEGORIES = [
  { id: 'C001', name: '여성의류', slug: 'womens-clothing', sortOrder: 1, active: true, showCount: 128 },
  { id: 'C002', name: '신발', slug: 'shoes', sortOrder: 2, active: true, showCount: 89 },
  { id: 'C003', name: '핸드백', slug: 'handbags', sortOrder: 3, active: true, showCount: 64 },
  { id: 'C004', name: '홈/리빙', slug: 'home-living', sortOrder: 4, active: true, showCount: 41 },
  { id: 'C005', name: '남성의류', slug: 'mens-clothing', sortOrder: 5, active: true, showCount: 55 },
  { id: 'C006', name: '키즈', slug: 'kids', sortOrder: 6, active: false, showCount: 18 },
  { id: 'C007', name: '뷰티', slug: 'beauty', sortOrder: 7, active: true, showCount: 33 },
];

export const EVENTS = [
  { id: 'EV001', title: '봄맞이 패션위크 라이브', description: '봄 신상 패션 아이템 특가 기획전', startDate: '2026-05-01T10:00', endDate: '2026-05-07T23:59', status: 'scheduled', showCount: 0, bannerUrl: '' },
  { id: 'EV002', title: '어버이날 선물 특별전', description: '어버이날 맞이 선물용 상품 모음', startDate: '2026-05-05T00:00', endDate: '2026-05-08T23:59', status: 'scheduled', showCount: 0, bannerUrl: '' },
  { id: 'EV003', title: '4월 뷰티 페스타', description: '봄 뷰티 아이템 특가 라이브', startDate: '2026-04-15T10:00', endDate: '2026-04-30T23:59', status: 'live', showCount: 12, bannerUrl: '' },
  { id: 'EV004', title: '3월 홈리빙 특가전', description: '봄 인테리어 & 리빙 세일', startDate: '2026-03-01T00:00', endDate: '2026-03-31T23:59', status: 'done', showCount: 28, bannerUrl: '' },
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
