import React from "react";
import {
  Shirt,
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Waves,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "closet", label: "내 옷장", icon: Shirt },
    { id: "outfits", label: "코디 세트", icon: Layers },
    { id: "laundry", label: "세탁 바구니", icon: Waves },
    { id: "wishlist", label: "위시리스트", icon: ShoppingBag },
    { id: "dashboard", label: "통계 분석", icon: LayoutDashboard },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-20 shrink-0 flex-col border-r border-gray-200 bg-white md:flex md:w-64">
        <div className="flex h-16 items-center justify-center border-b border-gray-100 px-6 md:justify-start">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            W
          </div>
          <span className="ml-3 hidden text-lg font-bold md:block">
            wardrobe
          </span>
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
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gray-200 bg-white px-2 py-2 shadow-lg md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all ${
              activeTab === item.id ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <item.icon
              className={`h-5 w-5 ${activeTab === item.id ? "scale-110" : ""}`}
            />
            <span className="mt-1 text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
