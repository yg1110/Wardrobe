import React from "react";
import { ClosetItem } from "../types";
import { Waves, CheckCircle } from "lucide-react";

interface LaundryTrackerProps {
  items: ClosetItem[];
  onToggleLaundry: (id: string) => void;
}

const LaundryTracker: React.FC<LaundryTrackerProps> = ({
  items,
  onToggleLaundry,
}) => {
  const dirtyItems = items.filter((i) => i.isDirty);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-gray-800">
          <Waves className="mr-2 h-6 w-6 text-amber-500" />
          세탁이 필요한 옷들
        </h2>
        <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700">
          총 {dirtyItems.length}벌
        </span>
      </div>

      {dirtyItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {dirtyItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-white shadow-sm"
            >
              <img
                src={item.photo}
                className="aspect-[3/4] w-full object-cover opacity-80"
              />
              <div className="p-3">
                <p className="truncate text-xs font-bold text-gray-700">
                  {item.subCategory || item.category}
                </p>
                <button
                  onClick={() => onToggleLaundry(item.id)}
                  className="mt-2 flex w-full items-center justify-center rounded-lg bg-green-500 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-green-600"
                >
                  <CheckCircle className="mr-1 h-3 w-3" /> 세탁 완료
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white text-gray-400">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
            <CheckCircle className="h-10 w-10" />
          </div>
          <p className="font-bold text-gray-500">모든 옷이 깨끗합니다!</p>
          <p className="text-sm">현재 세탁 바구니가 비어있습니다.</p>
        </div>
      )}
    </div>
  );
};

export default LaundryTracker;
