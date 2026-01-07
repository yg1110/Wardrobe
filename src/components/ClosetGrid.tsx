import React from "react";
import { ClosetItem } from "../types";
import { Trash2, CheckCircle, ExternalLink } from "lucide-react";

interface ClosetGridProps {
  items: ClosetItem[];
  onDelete: (id: string) => void;
  onWear: (id: string) => void;
  onEdit?: (item: ClosetItem) => void;
}

const ClosetGrid: React.FC<ClosetGridProps> = ({
  items,
  onDelete,
  onWear,
  onEdit,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:-translate-y-1 hover:shadow-xl md:rounded-2xl"
          onClick={() => onEdit?.(item)}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
            <img
              src={item.photo}
              alt={item.category}
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 md:space-x-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onWear(item.id)}
                className="rounded-full bg-green-500 p-1.5 text-white shadow-lg transition-transform hover:scale-110 md:p-2"
                title="오늘 입음 체크"
              >
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-transform hover:scale-110 md:p-2"
                title="삭제"
              >
                <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>
          <div className="p-2 md:p-4">
            <div className="mb-1 flex items-start justify-between">
              <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 md:px-2 md:text-xs">
                {item.category}
              </span>
              <div
                className="h-3 w-3 rounded-full border border-gray-200 md:h-4 md:w-4"
                style={{ backgroundColor: item.color }}
              />
            </div>
            <h3 className="truncate text-xs font-semibold text-gray-800 md:text-sm">
              {item.subCategory || item.category}
            </h3>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500 md:mt-2 md:text-[11px]">
              <span>
                입은 횟수:{" "}
                <span className="font-bold text-gray-900">
                  {item.wornCount}회
                </span>
              </span>
              <span className="text-[9px] md:text-[11px]">{item.season}</span>
            </div>
            {item.purchaseLink && (
              <a
                href={item.purchaseLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 block rounded-lg border border-gray-100 py-1 text-center text-[10px] text-gray-400 transition-colors hover:border-blue-100 hover:text-blue-600 md:mt-3 md:py-1.5 md:text-[11px]"
              >
                <ExternalLink className="mr-1 inline-block h-2.5 w-2.5 md:h-3 md:w-3" />
                구매처 바로가기
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClosetGrid;
