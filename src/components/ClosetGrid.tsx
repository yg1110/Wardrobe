import React from "react";
import { ClosetItem } from "../types";
import { Trash2, CheckCircle, ExternalLink } from "lucide-react";

interface ClosetGridProps {
  items: ClosetItem[];
  onDelete: (id: string) => void;
  onWear: (id: string) => void;
}

const ClosetGrid: React.FC<ClosetGridProps> = ({ items, onDelete, onWear }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 relative"
        >
          <div className="aspect-[3/4] overflow-hidden bg-gray-200 relative">
            <img
              src={item.photo}
              alt={item.category}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
              <button
                onClick={() => onWear(item.id)}
                className="bg-green-500 p-2 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                title="오늘 입음 체크"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                title="삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {item.category}
              </span>
              <div
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: item.color }}
              />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 truncate">
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
                className="mt-3 block text-center py-1.5 border border-gray-100 rounded-lg text-[11px] text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-colors"
              >
                <ExternalLink className="inline-block w-3 h-3 mr-1" />
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
