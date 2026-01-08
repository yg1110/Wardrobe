import { supabase } from "../lib/supabase";
import { Outfit } from "../types";

// Supabase에서 반환되는 데이터 타입
interface SupabaseOutfit {
  id: string;
  user_id: string;
  name: string;
  item_ids: string[];
  created_at: string;
  updated_at: string;
}

// Supabase 데이터를 Outfit으로 변환
function transformSupabaseOutfit(outfit: SupabaseOutfit): Outfit {
  return {
    id: outfit.id,
    name: outfit.name,
    itemIds: outfit.item_ids,
    createdAt: outfit.created_at,
  };
}

// 모든 코디 세트 가져오기
export async function fetchOutfits(): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("코디 세트를 가져오는 중 오류:", error);
    throw error;
  }

  return (data || []).map(transformSupabaseOutfit);
}

// 새 코디 세트 추가
export async function addOutfit(
  outfit: Omit<Outfit, "id" | "createdAt">,
): Promise<Outfit> {
  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const outfitToInsert = {
    user_id: user.id,
    name: outfit.name,
    item_ids: outfit.itemIds,
  };

  const { data, error } = await supabase
    .from("outfits")
    .insert([outfitToInsert] as any)
    .select()
    .single();

  if (error) {
    console.error("코디 세트를 추가하는 중 오류:", error);
    throw error;
  }

  return transformSupabaseOutfit(data as SupabaseOutfit);
}

// 코디 세트 업데이트
export async function updateOutfit(
  id: string,
  updates: {
    name?: string;
    item_ids?: string[];
  },
): Promise<Outfit> {
  const updateData: any = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.item_ids !== undefined) updateData.item_ids = updates.item_ids;

  const { data, error } = await (supabase.from("outfits") as any)
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("코디 세트를 업데이트하는 중 오류:", error);
    throw error;
  }

  return transformSupabaseOutfit(data as SupabaseOutfit);
}

// 코디 세트 삭제
export async function deleteOutfit(id: string): Promise<void> {
  const { error } = await supabase.from("outfits").delete().eq("id", id);

  if (error) {
    console.error("코디 세트를 삭제하는 중 오류:", error);
    throw error;
  }
}
