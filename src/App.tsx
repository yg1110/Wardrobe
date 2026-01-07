import React, { useState, useEffect, useCallback } from "react";
import { ClosetItem, Category, Season } from "./types";
import { CATEGORIES, SEASON_OPTIONS } from "./constants";
import Sidebar from "./components/Sidebar";
import ClosetGrid from "./components/ClosetGrid";
import AddItemModal from "./components/AddItemModal";
import Dashboard from "./components/Dashboard";
import AIRecommendations from "./components/AIRecommendations";
import ClosetAnalysis from "./components/ClosetAnalysis";
import Auth from "./components/Auth";
import { Search, Plus, Shirt, LogOut } from "lucide-react";
import CustomSelect from "./components/CustomSelect";
import { supabase } from "./lib/supabase";
import {
  fetchClosetItems,
  addClosetItem,
  updateClosetItem,
  deleteClosetItem,
} from "./services/closetService";

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [activeTab, setActiveTab] = useState<
    "closet" | "dashboard" | "ai-rec" | "ai-tips"
  >("closet");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<Category | "All">("All");
  const [filterSeason, setFilterSeason] = useState<Season | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsLoading, setItemsLoading] = useState(false);

  // 인증 상태 확인
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadItems();
      } else {
        setItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Supabase에서 데이터 로드
  const loadItems = async () => {
    try {
      setItemsLoading(true);
      const data = await fetchClosetItems();
      setItems(data);
    } catch (error) {
      console.error("옷장 아이템을 불러오는 중 오류:", error);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const handleAuthSuccess = () => {
    // 인증 성공 후 사용자 정보 다시 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setItems([]);
  };

  const handleAddItem = async (newItem: ClosetItem) => {
    try {
      const savedItem = await addClosetItem(newItem);
      setItems((prev) => [savedItem, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("옷장 아이템을 추가하는 중 오류:", error);
      alert("아이템을 추가하는 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteClosetItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("옷장 아이템을 삭제하는 중 오류:", error);
      alert("아이템을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  const handleWornToday = async (id: string) => {
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const updatedWornCount = item.wornCount + 1;
      const updatedLastWornDate = new Date().toISOString();
      await updateClosetItem(id, {
        worn_count: updatedWornCount,
        last_worn_date: updatedLastWornDate,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                wornCount: updatedWornCount,
                lastWornDate: updatedLastWornDate,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("입은 횟수를 업데이트하는 중 오류:", error);
      alert("입은 횟수를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;
    const matchesSeason =
      filterSeason === "All" || item.season === filterSeason;
    const matchesSearch =
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subCategory?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      );
    return matchesCategory && matchesSeason && matchesSearch;
  });

  const categoryOptions = [
    { label: "모든 종류", value: "All" },
    ...CATEGORIES.map((c) => ({ label: c, value: c })),
  ];

  const seasonOptions = [
    { label: "모든 시즌", value: "All" },
    ...SEASON_OPTIONS.map((s) => ({ label: s, value: s })),
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Mobile Sidebar Trigger (simplified for now) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 md:px-6">
          <h1 className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold text-gray-800 md:text-xl">
            {activeTab === "closet" && "내 옷장"}
            {activeTab === "dashboard" && "분석 및 통계"}
            {activeTab === "ai-rec" && "AI 코디 추천"}
            {activeTab === "ai-tips" && "AI 정리 가이드"}
          </h1>

          <button
            onClick={handleLogout}
            className="flex-shrink-0 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
            title="로그아웃"
          >
            <LogOut className="h-5 w-5" />
          </button>

          {activeTab === "closet" && (
            <div className="flex flex-shrink-0 items-center space-x-2 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-6 -translate-y-1/2 text-gray-400 md:w-4" />
                <input
                  type="text"
                  placeholder="검색..."
                  className="w-28 rounded-full border-none bg-gray-100 py-2 pl-9 pr-3 text-xs transition-all focus:ring-2 focus:ring-blue-500 sm:w-40 md:w-64 md:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-shrink-0 rounded-full bg-blue-600 p-1.5 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95 md:p-2"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === "closet" && (
            <div className="space-y-6">
              {itemsLoading ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-2 text-gray-400">
                  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="text-sm">데이터를 불러오는 중...</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-row gap-2 pb-1">
                    <CustomSelect
                      options={categoryOptions}
                      value={filterCategory}
                      onChange={(val) => setFilterCategory(val as any)}
                      className="min-w-[120px] flex-1"
                    />
                    <CustomSelect
                      options={seasonOptions}
                      value={filterSeason}
                      onChange={(val) => setFilterSeason(val as any)}
                      className="min-w-[120px] flex-1"
                    />
                  </div>

                  {filteredItems.length > 0 ? (
                    <ClosetGrid
                      items={filteredItems}
                      onDelete={handleDeleteItem}
                      onWear={handleWornToday}
                    />
                  ) : (
                    <div className="flex h-64 flex-col items-center justify-center space-y-2 text-gray-400">
                      <Shirt className="h-12 w-12 stroke-1" />
                      <p className="text-sm">
                        등록된 옷이 없거나 검색 결과가 없습니다.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "dashboard" && <Dashboard items={items} />}
          {activeTab === "ai-rec" && <AIRecommendations items={items} />}
          {activeTab === "ai-tips" && <ClosetAnalysis />}
        </div>
      </main>

      {isModalOpen && (
        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddItem}
        />
      )}
    </div>
  );
};

export default App;
