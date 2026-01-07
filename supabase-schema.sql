-- Supabase 데이터베이스 스키마
-- Supabase 대시보드의 SQL Editor에서 실행하세요.

-- closet_items 테이블 생성
CREATE TABLE IF NOT EXISTS public.closet_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  season TEXT NOT NULL,
  color TEXT NOT NULL,
  purchase_link TEXT,
  price INTEGER,
  purchase_date DATE,
  worn_count INTEGER DEFAULT 0,
  last_worn_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_closet_items_updated_at
  BEFORE UPDATE ON public.closet_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
-- 모든 사용자가 읽기/쓰기 가능하도록 설정 (필요에 따라 수정하세요)
ALTER TABLE public.closet_items ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Allow public read access" ON public.closet_items
  FOR SELECT USING (true);

-- 모든 사용자가 삽입 가능
CREATE POLICY "Allow public insert access" ON public.closet_items
  FOR INSERT WITH CHECK (true);

-- 모든 사용자가 업데이트 가능
CREATE POLICY "Allow public update access" ON public.closet_items
  FOR UPDATE USING (true);

-- 모든 사용자가 삭제 가능
CREATE POLICY "Allow public delete access" ON public.closet_items
  FOR DELETE USING (true);

-- Storage 버킷 생성 (Supabase 대시보드의 Storage에서도 생성 가능)
-- Storage > Create bucket > bucket name: "closet-images", public: true

