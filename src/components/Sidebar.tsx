import React from "react";
import { Shirt, LayoutDashboard, Wand2, Sparkles } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "closet", label: "내 옷장", icon: Shirt },
    { id: "dashboard", label: "통계 분석", icon: LayoutDashboard },
    // { id: "ai-rec", label: "추천 조합", icon: Wand2 },
    // { id: "ai-tips", label: "정리 팁", icon: Sparkles },
  ];

  return (
    <aside className="flex w-20 shrink-0 flex-col border-r border-gray-200 bg-white md:w-64">
      <div className="flex h-16 items-center justify-center border-b border-gray-100 px-6 md:justify-start">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
          W
        </div>
        <span className="ml-3 hidden text-lg font-bold md:block">wardrobe</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full items-center rounded-xl p-3 transition-all ${
              activeTab === item.id
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <item.icon className="h-6 w-6 shrink-0" />
            <span className="ml-3 hidden font-medium md:block">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* <div className="hidden border-t border-gray-100 p-4 md:block">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-lg">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-80">
            PRO AI Feature
          </p>
          <p className="text-sm font-bold leading-snug">
            오늘 날씨에 맞는 옷을 추천받아보세요!
          </p>
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;
