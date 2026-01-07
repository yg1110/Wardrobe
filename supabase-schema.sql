-- closet_items 테이블 생성
CREATE TABLE IF NOT EXISTS public.closet_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
ALTER TABLE public.closet_items ENABLE ROW LEVEL SECURITY;

-- 업로드 정책: 파일 경로가 user_id/filename 형식이어야 함
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'closet-images' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- 읽기 정책: 자신의 파일만 읽기 가능
CREATE POLICY "Users can view own images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'closet-images' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- 삭제 정책: 자신의 파일만 삭제 가능
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'closet-images' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);
