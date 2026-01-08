import React from "react";
import { ClosetItem } from "../types";
import { Trash2, CheckCircle, ExternalLink, Waves } from "lucide-react";

interface ClosetGridProps {
  items: ClosetItem[];
  onDelete: (id: string) => void;
  onWear: (id: string) => void;
  onEdit: (item: ClosetItem) => void;
  onToggleLaundry: (id: string) => void;
}

const ClosetGrid: React.FC<ClosetGridProps> = ({
  items,
  onDelete,
  onWear,
  onEdit,
  onToggleLaundry,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <div
          onClick={() => onEdit?.(item)}
          key={item.id}
          className={`group rounded-2xl border bg-white ${item.isDirty ? "border-2 border-amber-400" : "border-gray-100"} relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl`}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
            <img
              src={item.photo}
              alt={item.category}
              className={`h-full w-full object-cover ${item.isDirty ? "opacity-80 grayscale-[0.3]" : ""}`}
            />
            {item.isDirty && (
              <div className="absolute left-2 top-2 flex items-center rounded-lg bg-amber-500 p-1 text-[10px] font-bold text-white shadow-md">
                <Waves className="mr-1 h-3 w-3" />
                세탁필요
              </div>
            )}
            {/* PC용 호버 버튼 (md 이상에서만 표시) */}
            <div className="absolute inset-0 hidden items-center justify-center space-x-3 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWear(item.id);
                }}
                className="rounded-full bg-green-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
                title="오늘 입음"
              >
                <CheckCircle className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLaundry(item.id);
                }}
                className={`${item.isDirty ? "bg-blue-500" : "bg-amber-500"} rounded-full p-2 text-white shadow-lg transition-transform hover:scale-110`}
                title={item.isDirty ? "세탁 완료" : "세탁 필요"}
              >
                <Waves className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
                title="삭제"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-1 flex items-start justify-between">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="whitespace-nowrap rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  {item.category}
                </span>
                {item.purchaseLink && (
                  <a
                    href={item.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded-md p-1 text-gray-300 transition-all hover:bg-blue-50 hover:text-blue-500"
                    title="구매 링크로 이동"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: item.color }}
              />
            </div>
            <h3 className="truncate text-sm font-semibold text-gray-800">
              {item.subCategory || item.category}
            </h3>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
              <span>
                입은 횟수:{" "}
                <span className="font-bold text-gray-900">
                  {item.wornCount}회
                </span>
              </span>
              <span>{item.season}</span>
            </div>
            {item.price && (
              <div className="mt-1 text-[10px] text-gray-400">
                1회 착용 비용:{" "}
                <span className="font-medium text-blue-600">
                  ₩
                  {Math.round(
                    item.price / (item.wornCount || 1),
                  ).toLocaleString()}
                </span>
              </div>
            )}
            {/* 모바일용 버튼 (md 미만에서만 표시) */}
            <div className="mt-3 flex items-center justify-center gap-2 border-t border-gray-100 pt-3 md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWear(item.id);
                }}
                className="flex-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-medium text-white shadow-sm transition-transform active:scale-95"
              >
                <CheckCircle className="mx-auto h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLaundry(item.id);
                }}
                className={`${item.isDirty ? "bg-blue-500" : "bg-amber-500"} flex-1 rounded-lg px-3 py-2 text-xs font-medium text-white shadow-sm transition-transform active:scale-95`}
              >
                <Waves className="mx-auto h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white shadow-sm transition-transform active:scale-95"
              >
                <Trash2 className="mx-auto h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClosetGrid;
