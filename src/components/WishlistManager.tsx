import React, { useState } from "react";
import { WishlistItem, Category } from "../types";
import { CATEGORIES } from "../constants";
import CustomSelect from "./CustomSelect";
import {
  ShoppingBag,
  Plus,
  Trash2,
  ExternalLink,
  Pencil,
  X,
} from "lucide-react";

interface WishlistManagerProps {
  list: WishlistItem[];
  onAdd: (item: WishlistItem) => void;
  onUpdate: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
}

const WishlistManager: React.FC<WishlistManagerProps> = ({
  list,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("상의");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");

  const handleStartEdit = (item: WishlistItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price?.toString() || "");
    setLink(item.link || "");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setName("");
    setCategory("상의");
    setPrice("");
    setLink("");
  };

  const handleSave = () => {
    if (!name) return;

    if (editingId) {
      onUpdate({
        id: editingId,
        name,
        category,
        price: price ? parseInt(price) : undefined,
        link,
      });
    } else {
      onAdd({
        id: Date.now().toString(),
        name,
        category,
        price: price ? parseInt(price) : undefined,
        link,
      });
    }

    handleCancel();
  };

  return (
    <div className="animate-in slide-in-from-bottom-2 space-y-8 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-gray-800">
          <ShoppingBag className="mr-2 h-6 w-6 text-pink-500" />
          위시리스트
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg transition-colors hover:bg-pink-600"
          >
            <Plus className="mr-2 h-4 w-4" /> 아이템 추가
          </button>
        )}
      </div>

      {isAdding && (
        <div className="space-y-6 rounded-3xl border-2 border-pink-100 bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-pink-600">
              {editingId ? "아이템 수정" : "새로운 아이템 추가"}
            </h3>
            <button
              onClick={handleCancel}
              className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                상품명
              </label>
              <input
                type="text"
                placeholder="예: 블랙 트렌치코트"
                className="w-full rounded-xl border-none bg-gray-50 p-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-pink-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                카테고리
              </label>
              <CustomSelect
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                value={category}
                onChange={(v) => setCategory(v as Category)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                예상 가격 (선택)
              </label>
              <input
                type="number"
                placeholder="숫자만 입력"
                className="w-full rounded-xl border-none bg-gray-50 p-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-pink-400"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                상품 링크 (선택)
              </label>
              <input
                type="text"
                placeholder="https://..."
                className="w-full rounded-xl border-none bg-gray-50 p-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-pink-400"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-600 transition-colors hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-[2] rounded-2xl bg-pink-500 py-4 font-bold text-white shadow-lg shadow-pink-200 transition-all hover:bg-pink-600 active:scale-95"
            >
              {editingId ? "수정 완료" : "위시리스트 추가"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  상품 정보
                </th>
                <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  카테고리
                </th>
                <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  가격
                </th>
                <th className="p-5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-gray-50"
                >
                  <td className="p-5">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-800">
                        {item.name}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 p-1 text-gray-300 transition-all hover:text-blue-500"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-5 text-sm font-semibold text-gray-600">
                    {item.price ? (
                      `₩${item.price.toLocaleString()}`
                    ) : (
                      <span className="font-normal text-gray-300">미정</span>
                    )}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end space-x-1">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="rounded-xl p-2 text-gray-300 transition-all hover:bg-blue-50 hover:text-blue-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-xl p-2 text-gray-300 transition-all hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WishlistManager;
