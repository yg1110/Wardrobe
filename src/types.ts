export type Season = "봄" | "여름" | "가을" | "겨울" | "사계절";

export type Category =
  | "상의"
  | "하의"
  | "아우터"
  | "원피스"
  | "일상복"
  | "정장"
  | "투피스"
  | "신발/잡화";

export type SubCategory =
  // 상의
  | "티셔츠"
  | "셔츠"
  | "블라우스"
  | "니트"
  | "맨투맨"
  | "후드"
  | "폴로셔츠"
  // 하의
  | "청바지"
  | "슬랙스"
  | "면바지"
  | "반바지"
  | "치마"
  | "레깅스"
  | "조거팬츠"
  // 아우터
  | "코트"
  | "자켓"
  | "점퍼"
  | "가디건"
  | "패딩"
  | "베스트"
  | "트렌치코트"
  // 원피스
  | "미니 원피스"
  | "롱 원피스"
  | "점프수트"
  // 일상복 (테마)
  | "운동복"
  | "데이트룩"
  | "출근룩"
  | "잠옷"
  | "원마일웨어"
  | "등산복"
  // 정장
  | "셋업 정장"
  | "정장 자켓"
  | "정장 바지"
  | "드레스 셔츠"
  // 투피스
  | "투피스(치마)"
  | "투피스(바지)"
  // 잡화
  | "운동화"
  | "구두"
  | "샌들/슬리퍼"
  | "가방"
  | "모자"
  | "안경/액세서리"
  | "양말/스타킹"
  | "기타";

export interface ClosetItem {
  id: string;
  photo: string;
  season: Season;
  color: string;
  category: Category;
  subCategory?: SubCategory;
  purchaseLink?: string;
  price?: number;
  purchaseDate?: string;
  wornCount: number;
  lastWornDate?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  items: string[];
  description: string;
}

export interface ClosetTip {
  title: string;
  content: string;
}
