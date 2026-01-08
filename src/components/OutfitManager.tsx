import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ClosetItem, Outfit } from "../types";
import { Layers, Plus, X, Trash2, Pencil, Waves } from "lucide-react";

interface OutfitManagerProps {
  items: ClosetItem[];
  outfits: Outfit[];
  onSave: (outfit: Omit<Outfit, "id" | "createdAt">) => void;
  onUpdate: (
    id: string,
    updates: { name?: string; itemIds?: string[] },
  ) => void;
  onDelete: (id: string) => void;
}

const OutfitManager: React.FC<OutfitManagerProps> = ({
  items,
  outfits,
  onSave,
  onUpdate,
  onDelete,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newOutfitName, setNewOutfitName] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleStartEdit = (outfit: Outfit) => {
    setEditingId(outfit.id);
    setNewOutfitName(outfit.name);
    setSelectedItemIds([...outfit.itemIds]);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setNewOutfitName("");
    setSelectedItemIds([]);
  };

  // 모달이 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isCreating) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCreating]);

  const handleSave = () => {
    if (!newOutfitName || selectedItemIds.length === 0) return;

    if (editingId) {
      onUpdate(editingId, {
        name: newOutfitName,
        itemIds: selectedItemIds,
      });
    } else {
      onSave({
        name: newOutfitName,
        itemIds: selectedItemIds,
      });
    }

    handleCancel();
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-gray-800">
          <Layers className="mr-2 h-6 w-6 text-blue-600" />
          코디 세트 관리
        </h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> 새 코디 만들기
          </button>
        )}
      </div>

      {isCreating &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm md:items-center md:p-4">
            <div className="animate-in fade-in zoom-in flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl duration-200 md:max-h-[90vh] md:rounded-3xl">
              <header className="flex items-center justify-between border-b p-4 md:p-6">
                <h2 className="text-lg font-bold md:text-xl">
                  {editingId ? "코디 수정하기" : "새로운 코디 만들기"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </header>

              <div className="flex-1 space-y-6 overflow-y-auto p-4 md:space-y-8 md:p-8">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">
                    코디 이름
                  </label>
                  <input
                    type="text"
                    placeholder="예: 금요일 데이트룩"
                    className="w-full border-b-2 border-gray-100 pb-1 text-xl font-bold outline-none transition-colors focus:border-blue-500"
                    value={newOutfitName}
                    onChange={(e) => setNewOutfitName(e.target.value)}
                  />
                </div>

                <div>
                  <p className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    옷장에서 아이템 선택 ({selectedItemIds.length})
                  </p>
                  <div className="grid max-h-[400px] grid-cols-3 gap-3 overflow-y-auto rounded-2xl bg-gray-50 p-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleItemSelection(item.id)}
                        className={`relative aspect-[3/4] overflow-hidden rounded-xl border-4 transition-all ${
                          selectedItemIds.includes(item.id)
                            ? "scale-[0.98] border-blue-500 ring-2 ring-blue-100"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={item.photo}
                          className="h-full w-full object-cover"
                          alt={item.category}
                        />
                        {selectedItemIds.includes(item.id) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10">
                            <div className="rounded-full bg-white p-1 shadow-lg">
                              <Plus className="h-4 w-4 rotate-45 text-blue-600" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <footer className="flex gap-3 border-t bg-gray-50 p-4 md:gap-4 md:p-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded-2xl py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100 md:py-4 md:text-base"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-[2] rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-400 md:py-4 md:text-base"
                  disabled={!newOutfitName || selectedItemIds.length === 0}
                >
                  {editingId ? "수정 완료" : "새 코디 저장하기"}
                </button>
              </footer>
            </div>
          </div>,
          document.body,
        )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="group relative flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {outfit.name}
                </h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                  생성일 {new Date(outfit.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleStartEdit(outfit)}
                  className="rounded-full p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-500"
                  title="수정"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(outfit.id)}
                  className="rounded-full p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              {outfit.itemIds.map((itemId) => {
                const item = items.find((i) => i.id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={itemId}
                    className={`h-18 w-14 overflow-hidden rounded-lg border border-gray-50 bg-gray-100 shadow-sm transition-transform hover:scale-110 ${item.isDirty ? "border-2 border-amber-400" : ""}`}
                  >
                    <div className="relative">
                      <img
                        src={item.photo}
                        className="h-full w-full object-cover"
                        alt="outfit item"
                      />
                      {item.isDirty && (
                        <div className="absolute left-2 top-2 flex items-center rounded-lg bg-amber-500 p-1 text-[10px] font-bold text-white shadow-md">
                          <Waves className="h-2 w-2" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitManager;
