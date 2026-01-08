import { supabase } from "../lib/supabase";
import { WishlistItem, Category } from "../types";

// Supabase에서 반환되는 데이터 타입
interface SupabaseWishlistItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  price: number | null;
  link: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

// Supabase 데이터를 WishlistItem으로 변환
function transformSupabaseWishlistItem(
  item: SupabaseWishlistItem,
): WishlistItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category as Category,
    price: item.price || undefined,
    link: item.link || undefined,
    memo: item.memo || undefined,
  };
}

// 모든 위시리스트 아이템 가져오기
export async function fetchWishlistItems(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("위시리스트 아이템을 가져오는 중 오류:", error);
    throw error;
  }

  return (data || []).map(transformSupabaseWishlistItem);
}

// 새 위시리스트 아이템 추가
export async function addWishlistItem(
  item: Omit<WishlistItem, "id">,
): Promise<WishlistItem> {
  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const itemToInsert = {
    user_id: user.id,
    name: item.name,
    category: item.category,
    price: item.price || null,
    link: item.link || null,
    memo: item.memo || null,
  };

  const { data, error } = await supabase
    .from("wishlist_items")
    .insert([itemToInsert] as any)
    .select()
    .single();

  if (error) {
    console.error("위시리스트 아이템을 추가하는 중 오류:", error);
    throw error;
  }

  return transformSupabaseWishlistItem(data as SupabaseWishlistItem);
}

// 위시리스트 아이템 업데이트
export async function updateWishlistItem(
  id: string,
  updates: {
    name?: string;
    category?: string;
    price?: number | null;
    link?: string | null;
    memo?: string | null;
  },
): Promise<WishlistItem> {
  const updateData: any = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.link !== undefined) updateData.link = updates.link;
  if (updates.memo !== undefined) updateData.memo = updates.memo;

  const { data, error } = await (supabase.from("wishlist_items") as any)
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("위시리스트 아이템을 업데이트하는 중 오류:", error);
    throw error;
  }

  return transformSupabaseWishlistItem(data as SupabaseWishlistItem);
}

// 위시리스트 아이템 삭제
export async function deleteWishlistItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("위시리스트 아이템을 삭제하는 중 오류:", error);
    throw error;
  }
}
