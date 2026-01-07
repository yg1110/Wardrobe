// Supabase 데이터베이스 타입 정의
// 이 파일은 Supabase CLI로 자동 생성할 수 있지만, 수동으로 정의합니다.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      closet_items: {
        Row: {
          id: string;
          photo: string;
          season: string;
          color: string;
          category: string;
          sub_category: string | null;
          purchase_link: string | null;
          price: number | null;
          purchase_date: string | null;
          worn_count: number;
          last_worn_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          photo: string;
          season: string;
          color: string;
          category: string;
          sub_category?: string | null;
          purchase_link?: string | null;
          price?: number | null;
          purchase_date?: string | null;
          worn_count?: number;
          last_worn_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          photo?: string;
          season?: string;
          color?: string;
          category?: string;
          sub_category?: string | null;
          purchase_link?: string | null;
          price?: number | null;
          purchase_date?: string | null;
          worn_count?: number;
          last_worn_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

