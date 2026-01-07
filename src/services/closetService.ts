import { supabase } from "../lib/supabase";
import { ClosetItem, SubCategory } from "../types";
import type { Database } from "../types/supabase";

type ClosetItemInsert = Database["public"]["Tables"]["closet_items"]["Insert"];

// Supabase에서 반환되는 데이터 타입
interface SupabaseClosetItem {
  id: string;
  user_id: string;
  photo: string;
  category: string;
  sub_category: string | null;
  season: string;
  color: string;
  purchase_link: string | null;
  price: number | null;
  purchase_date: string | null;
  worn_count: number;
  last_worn_date: string | null;
  created_at: string;
  updated_at: string;
}

// Supabase 데이터를 ClosetItem으로 변환
function transformSupabaseItem(item: SupabaseClosetItem): ClosetItem {
  return {
    id: item.id,
    photo: item.photo,
    category: item.category as any,
    subCategory: item.sub_category as SubCategory | undefined,
    season: item.season as any,
    color: item.color,
    purchaseLink: item.purchase_link || undefined,
    price: item.price || undefined,
    purchaseDate: item.purchase_date || undefined,
    wornCount: item.worn_count || 0,
    lastWornDate: item.last_worn_date || undefined,
  };
}

// 모든 옷장 아이템 가져오기
export async function fetchClosetItems(): Promise<ClosetItem[]> {
  const { data, error } = await supabase
    .from("closet_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("옷장 아이템을 가져오는 중 오류:", error);
    throw error;
  }

  return (data || []).map(transformSupabaseItem);
}

// 새 옷장 아이템 추가
export async function addClosetItem(
  item: Omit<ClosetItem, "id" | "wornCount" | "lastWornDate">,
): Promise<ClosetItem> {
  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const itemToInsert = {
    user_id: user.id,
    photo: item.photo,
    category: item.category,
    sub_category: item.subCategory || null,
    season: item.season,
    color: item.color,
    purchase_link: item.purchaseLink || null,
    price: item.price || null,
    purchase_date: item.purchaseDate || null,
    worn_count: 0,
    last_worn_date: null,
  } as ClosetItemInsert;

  const { data, error } = await supabase
    .from("closet_items")
    .insert([itemToInsert] as any)
    .select()
    .single();

  if (error) {
    console.error("옷장 아이템을 추가하는 중 오류:", error);
    throw error;
  }

  return transformSupabaseItem(data as SupabaseClosetItem);
}

// 옷장 아이템 업데이트
export async function updateClosetItem(
  id: string,
  updates: {
    worn_count?: number;
    last_worn_date?: string | null;
  },
): Promise<ClosetItem> {
  const { data, error } = await (supabase.from("closet_items") as any)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("옷장 아이템을 업데이트하는 중 오류:", error);
    throw error;
  }

  return transformSupabaseItem(data as SupabaseClosetItem);
}

// 옷장 아이템 삭제
export async function deleteClosetItem(id: string): Promise<void> {
  const { error } = await supabase.from("closet_items").delete().eq("id", id);

  if (error) {
    console.error("옷장 아이템을 삭제하는 중 오류:", error);
    throw error;
  }
}

// 이미지를 Supabase Storage에 업로드
export async function uploadImage(file: File, itemId: string): Promise<string> {
  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "로그인이 필요합니다. 이미지를 업로드하려면 로그인해주세요.",
    );
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${itemId}-${Date.now()}.${fileExt}`;
  // 파일 경로: user_id/filename 형식 (버킷 이름 제외)
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("closet-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("이미지 업로드 중 오류:", uploadError);
    throw uploadError;
  }

  // 공개 URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from("closet-images").getPublicUrl(filePath);

  return publicUrl;
}

// 이미지 삭제
export async function deleteImage(imageUrl: string): Promise<void> {
  // URL에서 파일 경로 추출
  // URL 형식: https://...supabase.co/storage/v1/object/public/closet-images/user_id/filename
  const urlParts = imageUrl.split("/");
  const bucketIndex = urlParts.indexOf("closet-images");
  if (bucketIndex === -1) {
    console.warn("이미지 URL에서 경로를 추출할 수 없습니다:", imageUrl);
    return;
  }
  // 버킷 이름 다음부터가 파일 경로 (user_id/filename 형식)
  const filePath = urlParts.slice(bucketIndex + 1).join("/");

  const { error } = await supabase.storage
    .from("closet-images")
    .remove([filePath]);

  if (error) {
    console.error("이미지 삭제 중 오류:", error);
    // 이미지 삭제 실패는 치명적이지 않으므로 에러를 던지지 않음
    console.warn("이미지 삭제에 실패했지만 계속 진행합니다:", error);
  }
}
