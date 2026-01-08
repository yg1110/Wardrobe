import React, { useState, useEffect } from "react";
import { ClosetItem, Category, Season, Outfit, WishlistItem } from "./types";
import { CATEGORIES, SEASON_OPTIONS } from "./constants";
import Sidebar from "./components/Sidebar";
import ClosetGrid from "./components/ClosetGrid";
import AddItemModal from "./components/AddItemModal";
import Dashboard from "./components/Dashboard";
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
import LaundryTracker from "./components/LaundryTracker";
import OutfitManager from "./components/OutfitManager";
import WishlistManager from "./components/WishlistManager";
import ConfirmDialog from "./components/ConfirmDialog";
import { toast, Toaster } from "sonner";

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [activeTab, setActiveTab] = useState<
    "closet" | "outfits" | "laundry" | "wishlist" | "dashboard"
  >("closet");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClosetItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<Category | "All">("All");
  const [filterSeason, setFilterSeason] = useState<Season | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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

  const loadItems = async () => {
    try {
      setItemsLoading(true);
      const data = await fetchClosetItems();
      setItems(data);
    } catch (error) {
      console.error("옷장 아이템을 불러오는 중 오류:", error);
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
      setEditingItem(null);
    } catch (error) {
      console.error("옷장 아이템을 추가하는 중 오류:", error);
      toast.error("아이템을 추가하는 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<ClosetItem>) => {
    try {
      const updateData: any = {};
      if (updates.photo) updateData.photo = updates.photo;
      if (updates.category) updateData.category = updates.category;
      if (updates.subCategory !== undefined)
        updateData.sub_category = updates.subCategory || null;
      if (updates.season) updateData.season = updates.season;
      if (updates.color) updateData.color = updates.color;
      if (updates.purchaseLink !== undefined)
        updateData.purchase_link = updates.purchaseLink || null;
      if (updates.price !== undefined) updateData.price = updates.price || null;
      if (updates.purchaseDate !== undefined)
        updateData.purchase_date = updates.purchaseDate || null;
      if (updates.isDirty !== undefined) updateData.is_dirty = updates.isDirty;

      const updatedItem = await updateClosetItem(id, updateData);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item)),
      );
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("옷장 아이템을 수정하는 중 오류:", error);
      toast.error("아이템을 수정하는 중 오류가 발생했습니다.");
    }
  };

  const handleEditItem = (item: ClosetItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteClosetItem(itemToDelete);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete));
      toast.success("아이템이 삭제되었습니다.");
    } catch (error) {
      console.error("옷장 아이템을 삭제하는 중 오류:", error);
      toast.error("아이템을 삭제하는 중 오류가 발생했습니다.");
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
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
      toast.error("입은 횟수를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  const handleToggleLaundry = async (id: string) => {
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const updatedIsDirty = !item.isDirty;
      await updateClosetItem(id, {
        is_dirty: updatedIsDirty,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isDirty: updatedIsDirty,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("세탁 상태를 업데이트하는 중 오류:", error);
      toast.error("세탁 상태를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  const handleSaveOutfit = (o: Outfit) => {
    setOutfits((prev) => [o, ...prev]);
  };

  const handleUpdateOutfit = (updated: Outfit) => {
    setOutfits((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const handleAddWishlist = (w: WishlistItem) => {
    setWishlist((prev) => [w, ...prev]);
  };

  const handleUpdateWishlist = (updated: WishlistItem) => {
    setWishlist((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const toggleLaundry = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDirty: !item.isDirty } : item,
      ),
    );
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
      <Toaster />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden pb-16 md:pb-0">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 md:h-16 md:px-6">
          <h1 className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-gray-800 md:text-xl">
            {activeTab === "closet" && "내 옷장"}
            {activeTab === "dashboard" && "분석 및 통계"}
          </h1>

          {activeTab === "closet" && (
            <div className="flex flex-shrink-0 items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색..."
                  className="w-32 rounded-full border-none bg-gray-100 py-1.5 pl-8 pr-3 text-xs transition-all focus:ring-2 focus:ring-blue-500 md:w-64 md:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-shrink-0 rounded-full bg-blue-600 p-2 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95"
              >
                <Plus className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex-shrink-0 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
            title="로그아웃"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3 pb-20 md:p-8 md:pb-8">
          {activeTab === "closet" && (
            <div>
              {itemsLoading ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-2 text-gray-400">
                  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="text-sm">데이터를 불러오는 중...</p>
                </div>
              ) : (
                <>
                  <div className="relative sm:hidden">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="검색..."
                      className="mb-3 w-full rounded-full border-none bg-gray-100 py-2 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-row gap-2 pb-3">
                    <CustomSelect
                      options={categoryOptions}
                      value={filterCategory}
                      onChange={(val) => setFilterCategory(val as any)}
                      className="mt-0 min-w-0 flex-1"
                    />
                    <CustomSelect
                      options={seasonOptions}
                      value={filterSeason}
                      onChange={(val) => setFilterSeason(val as any)}
                      className="mt-0 min-w-0 flex-1"
                    />
                  </div>

                  {filteredItems.length > 0 ? (
                    <ClosetGrid
                      items={filteredItems}
                      onDelete={handleDeleteItem}
                      onWear={handleWornToday}
                      onToggleLaundry={handleToggleLaundry}
                      onEdit={handleEditItem}
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

          {activeTab === "outfits" && (
            <OutfitManager
              items={items}
              outfits={outfits}
              onSave={handleSaveOutfit}
              onUpdate={handleUpdateOutfit}
              onDelete={(id) =>
                setOutfits((prev) => prev.filter((o) => o.id !== id))
              }
            />
          )}
          {activeTab === "laundry" && (
            <LaundryTracker items={items} onToggleLaundry={toggleLaundry} />
          )}
          {activeTab === "wishlist" && (
            <WishlistManager
              list={wishlist}
              onAdd={handleAddWishlist}
              onUpdate={handleUpdateWishlist}
              onDelete={(id) =>
                setWishlist((prev) => prev.filter((w) => w.id !== id))
              }
            />
          )}
          {activeTab === "dashboard" && (
            <Dashboard items={items} outfits={outfits} wishlist={wishlist} />
          )}
        </div>
      </main>

      {isModalOpen && (
        <AddItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddItem}
          editingItem={editingItem}
          onUpdate={handleUpdateItem}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="아이템 삭제"
        message={
          <>
            정말로 이 아이템을 삭제하시겠습니까?
            <br />이 작업은 되돌릴 수 없습니다.
          </>
        }
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
};

export default App;
