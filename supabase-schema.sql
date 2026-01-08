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
  is_dirty BOOLEAN DEFAULT false,
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

-- closet_items 읽기 정책: 자신의 데이터만 읽기 가능
CREATE POLICY "Users can view own closet items"
ON public.closet_items FOR SELECT
USING (auth.uid() = user_id);

-- closet_items 삽입 정책: 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert own closet items"
ON public.closet_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- closet_items 수정 정책: 자신의 데이터만 수정 가능
CREATE POLICY "Users can update own closet items"
ON public.closet_items FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- closet_items 삭제 정책: 자신의 데이터만 삭제 가능
CREATE POLICY "Users can delete own closet items"
ON public.closet_items FOR DELETE
USING (auth.uid() = user_id);

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

-- outfits 테이블 생성
CREATE TABLE IF NOT EXISTS public.outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  item_ids TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- outfits updated_at 트리거 생성
CREATE TRIGGER update_outfits_updated_at
  BEFORE UPDATE ON public.outfits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- outfits RLS 정책 설정
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

-- outfits 읽기 정책: 자신의 데이터만 읽기 가능
CREATE POLICY "Users can view own outfits"
ON public.outfits FOR SELECT
USING (auth.uid() = user_id);

-- outfits 삽입 정책: 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert own outfits"
ON public.outfits FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- outfits 수정 정책: 자신의 데이터만 수정 가능
CREATE POLICY "Users can update own outfits"
ON public.outfits FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- outfits 삭제 정책: 자신의 데이터만 삭제 가능
CREATE POLICY "Users can delete own outfits"
ON public.outfits FOR DELETE
USING (auth.uid() = user_id);

-- wishlist_items 테이블 생성
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER,
  link TEXT,
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- wishlist_items updated_at 트리거 생성
CREATE TRIGGER update_wishlist_items_updated_at
  BEFORE UPDATE ON public.wishlist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- wishlist_items RLS 정책 설정
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- wishlist_items 읽기 정책: 자신의 데이터만 읽기 가능
CREATE POLICY "Users can view own wishlist items"
ON public.wishlist_items FOR SELECT
USING (auth.uid() = user_id);

-- wishlist_items 삽입 정책: 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert own wishlist items"
ON public.wishlist_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- wishlist_items 수정 정책: 자신의 데이터만 수정 가능
CREATE POLICY "Users can update own wishlist items"
ON public.wishlist_items FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- wishlist_items 삭제 정책: 자신의 데이터만 삭제 가능
CREATE POLICY "Users can delete own wishlist items"
ON public.wishlist_items FOR DELETE
USING (auth.uid() = user_id);
