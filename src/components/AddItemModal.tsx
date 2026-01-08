import React, { useState, useRef, useEffect } from "react";
import { ClosetItem, Category, SubCategory, Season } from "../types";
import { CATEGORIES, CATEGORY_MAP, SEASON_OPTIONS, COLORS } from "../constants";
import CustomSelect from "./CustomSelect";
import { X, Camera } from "lucide-react";
import { uploadImage } from "../services/closetService";
import { toast } from "sonner";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: ClosetItem) => void;
  editingItem?: ClosetItem | null;
  onUpdate?: (id: string, item: Partial<ClosetItem>) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editingItem,
  onUpdate,
}) => {
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [category, setCategory] = useState<Category>("일상복");
  const [subCategory, setSubCategory] = useState<SubCategory | "">("");
  const [season, setSeason] = useState<Season>("사계절");
  const [color, setColor] = useState(COLORS[0]);
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 가격 포맷팅 함수 (천 단위 구분자 추가)
  const formatPrice = (value: string): string => {
    if (!value) return "";
    const numericValue = value.replace(/,/g, "");
    if (numericValue === "" || isNaN(parseInt(numericValue))) return "";
    return parseInt(numericValue).toLocaleString("ko-KR");
  };

  // 가격 포맷팅 제거 함수 (숫자만 추출)
  const unformatPrice = (value: string): string => {
    return value.replace(/,/g, "");
  };

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (editingItem) {
      setPhoto(editingItem.photo);
      setPhotoFile(null);
      setCategory(editingItem.category);
      setSubCategory(editingItem.subCategory || "");
      setSeason(editingItem.season);
      setColor(editingItem.color);
      setLink(editingItem.purchaseLink || "");
      setPrice(editingItem.price?.toString() || "");
      setDate(editingItem.purchaseDate || "");
      setIsPriceFocused(false);
    } else {
      // 추가 모드일 때 초기화
      setPhoto("");
      setPhotoFile(null);
      setCategory("일상복");
      setSubCategory("");
      setSeason("사계절");
      setColor(COLORS[0]);
      setLink("");
      setPrice("");
      setDate("");
      setIsPriceFocused(false);
    }
  }, [editingItem]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 수정 모드가 아닐 때만 새 사진 필수
    if (!editingItem && (!photo || !photoFile)) {
      toast.error("사진을 등록해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = photo;

      // 새 사진이 업로드된 경우에만 업로드
      if (photoFile) {
        const tempId = editingItem?.id || Date.now().toString();
        imageUrl = await uploadImage(photoFile, tempId);
      }

      if (editingItem && onUpdate) {
        // 수정 모드
        const updatedItem: Partial<ClosetItem> = {
          photo: imageUrl,
          category,
          subCategory: subCategory || undefined,
          season,
          color,
          purchaseLink: link || undefined,
          price: price ? parseInt(price) : undefined,
          purchaseDate: date || undefined,
        };
        await onUpdate(editingItem.id, updatedItem);
      } else {
        // 추가 모드
        const newItem: ClosetItem = {
          id: "", // ID는 Supabase에서 생성됨
          photo: imageUrl,
          category,
          subCategory: subCategory || undefined,
          season,
          color,
          purchaseLink: link,
          price: price ? parseInt(price) : undefined,
          purchaseDate: date,
          wornCount: 0,
          isDirty: false,
        };
        await onAdd(newItem);
      }
    } catch (error) {
      console.error(
        editingItem ? "아이템 수정 중 오류:" : "아이템 추가 중 오류:",
        error,
      );
      toast.error(
        editingItem
          ? "아이템을 수정하는 중 오류가 발생했습니다."
          : "아이템을 추가하는 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const categoryOptions = CATEGORIES.map((c) => ({ label: c, value: c }));
  const subCategoryOptions = (CATEGORY_MAP[category] || []).map((sc) => ({
    label: sc,
    value: sc,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm md:items-center md:p-4">
      <div className="animate-in fade-in zoom-in flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl duration-200 md:max-h-[90vh] md:rounded-3xl">
        <header className="flex items-center justify-between border-b p-4 md:p-6">
          <h2 className="text-lg font-bold md:text-xl">
            {editingItem ? "옷 정보 수정" : "새로운 옷 등록"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto p-4 md:space-y-8 md:p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            {/* Photo Section */}
            <div className="flex-1">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:border-blue-500 hover:bg-blue-50 md:aspect-[1/2] ${
                  photo ? "border-none" : "border-gray-300"
                }`}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="p-4 text-center">
                    <Camera className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500">
                      사진 업로드
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      파일을 선택하거나 드래그하세요
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-[1.5] space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                    종류
                  </label>
                  <CustomSelect
                    options={categoryOptions}
                    value={category}
                    placeholder="선택 안함"
                    onChange={(e) => {
                      setCategory(e as Category);
                      setSubCategory("");
                    }}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                    상세 분류
                  </label>
                  <CustomSelect
                    options={subCategoryOptions}
                    value={subCategory}
                    onChange={(val) => setSubCategory(val as SubCategory)}
                    placeholder="선택 안함"
                    disabled={subCategoryOptions.length === 0}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                  색상
                </label>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        color === c
                          ? "scale-110 border-blue-600"
                          : c === "#FFFFFF"
                            ? "border-gray-300"
                            : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                  시즌
                </label>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {SEASON_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeason(s)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all md:px-4 md:py-2 md:text-sm ${
                        season === s
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2 md:gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                    구매 정보
                  </label>
                  <input
                    type="text"
                    placeholder="구매처 링크 (선택)"
                    className="mb-2 w-full rounded-xl border-none bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="가격"
                      className="w-1/2 rounded-xl border-none bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                      value={isPriceFocused ? price : formatPrice(price)}
                      onChange={(e) => {
                        const value = unformatPrice(e.target.value);
                        if (value === "" || /^\d+$/.test(value)) {
                          setPrice(value);
                        }
                      }}
                      onFocus={() => {
                        setIsPriceFocused(true);
                        setPrice(unformatPrice(price));
                      }}
                      onBlur={() => {
                        setIsPriceFocused(false);
                      }}
                    />
                    <input
                      type="date"
                      className="w-1/2 rounded-xl border-none bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <footer className="flex gap-3 border-t bg-gray-50 p-4 md:gap-4 md:p-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100 md:py-4 md:text-base"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-[2] rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-400 md:py-4 md:text-base"
          >
            {isSubmitting
              ? editingItem
                ? "수정 중..."
                : "등록 중..."
              : editingItem
                ? "수정 완료"
                : "옷 등록하기"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddItemModal;
