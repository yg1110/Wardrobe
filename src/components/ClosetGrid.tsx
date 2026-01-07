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
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
          onClick={() => onEdit?.(item)}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
            <img
              src={item.photo}
              alt={item.category}
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-center justify-center space-x-3 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onWear(item.id)}
                className="rounded-full bg-green-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
                title="오늘 입음 체크"
              >
                <CheckCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
                title="삭제"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-1 flex items-start justify-between">
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">
                {item.category}
              </span>
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
            {item.purchaseLink && (
              <a
                href={item.purchaseLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3 block rounded-lg border border-gray-100 py-1.5 text-center text-[11px] text-gray-400 transition-colors hover:border-blue-100 hover:text-blue-600"
              >
                <ExternalLink className="mr-1 inline-block h-3 w-3" />
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
