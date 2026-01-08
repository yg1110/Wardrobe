import React from "react";
import { ClosetItem, Outfit, WishlistItem } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  Wallet,
  CheckCircle,
  Waves,
  Layers,
  ShoppingBag,
  TrendingUp,
  Shirt,
} from "lucide-react";

interface DashboardProps {
  items: ClosetItem[];
  outfits: Outfit[];
  wishlist: WishlistItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ items, outfits, wishlist }) => {
  // 1. Category Distribution
  const categoryData = items.reduce((acc: any[], item) => {
    const existing = acc.find((a) => a.name === item.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, []);

  // 2. Top worn items (Price per wear analysis)
  const frequencyData = items
    .filter((i) => i.wornCount > 0)
    .sort((a, b) => b.wornCount - a.wornCount)
    .slice(0, 5)
    .map((i) => ({
      name: i.subCategory || i.category,
      count: i.wornCount,
      color: i.color,
    }));

  // 3. Laundry Status Analysis
  const dirtyCount = items.filter((i) => i.isDirty).length;
  const cleanCount = items.length - dirtyCount;
  const laundryData = [
    { name: "즉시 착용 가능", value: cleanCount, color: "#10B981" },
    { name: "세탁 대기 중", value: dirtyCount, color: "#F59E0B" },
  ];

  // 4. Financial Status
  const totalClosetValue = items.reduce((sum, i) => sum + (i.price || 0), 0);
  const totalWishlistValue = wishlist.reduce(
    (sum, i) => sum + (i.price || 0),
    0,
  );

  // 5. Outfit Readiness (All items in outfit must be clean)
  const readyOutfitsCount = outfits.filter((outfit) => {
    return outfit.itemIds.every((id) => {
      const item = items.find((i) => i.id === id);
      return item && !item.isDirty;
    });
  }).length;

  // 6. Closet Utilization Rate
  const wornOnceCount = items.filter((i) => i.wornCount > 0).length;
  const utilizationRate =
    items.length > 0 ? Math.round((wornOnceCount / items.length) * 100) : 0;

  const COLORS_PALETTE = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
  ];

  return (
    <div className="animate-in fade-in space-y-8 pb-20 duration-500">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="transition-hover rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
              <Wallet className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              옷장 총 자산
            </h4>
          </div>
          <p className="text-2xl font-black text-gray-800">
            ₩{totalClosetValue.toLocaleString()}
          </p>
          <p className="mt-1.5 flex items-center text-[10px] text-gray-400">
            평균 ₩
            {items.length > 0
              ? Math.round(totalClosetValue / items.length).toLocaleString()
              : 0}{" "}
            / 벌
          </p>
        </div>

        <div className="transition-hover rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-2xl bg-pink-50 p-2.5 text-pink-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              위시리스트 예산
            </h4>
          </div>
          <p className="text-2xl font-black text-gray-800">
            ₩{totalWishlistValue.toLocaleString()}
          </p>
          <p className="mt-1.5 text-[10px] text-gray-400">
            아이템 {wishlist.length}개 대기 중
          </p>
        </div>

        <div className="transition-hover rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
              <Layers className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              준비된 코디
            </h4>
          </div>
          <p className="text-2xl font-black text-gray-800">
            {readyOutfitsCount}{" "}
            <span className="text-sm font-normal text-gray-400">
              / {outfits.length}개
            </span>
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{
                width: `${outfits.length > 0 ? (readyOutfitsCount / outfits.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="transition-hover rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-2xl bg-purple-50 p-2.5 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              옷장 활용도
            </h4>
          </div>
          <p className="text-2xl font-black text-gray-800">
            {utilizationRate}%
          </p>
          <p className="mt-1.5 text-[10px] text-gray-400">
            한 번이라도 착용한 비율
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Category Breakdown */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center text-lg font-bold">
            <Shirt className="mr-2 h-5 w-5 text-blue-500" />
            카테고리별 비중
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_PALETTE[index % COLORS_PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}개`, name]} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Laundry Progress */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center text-lg font-bold">
            <Waves className="mr-2 h-5 w-5 text-amber-500" />
            세탁/관리 상태
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={laundryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {laundryData.map((entry, index) => (
                    <Cell key={`cell-laundry-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}개`, name]} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Frequency Items */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
          <h3 className="mb-6 flex items-center text-lg font-bold">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            가장 자주 입은 옷 Top 5
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={frequencyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 500, fill: "#9ca3af" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: any) => [`${value}번`]}
                />
                <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={40}>
                  {frequencyData.map((entry, index) => (
                    <Cell
                      key={`cell-freq-${index}`}
                      fill={entry.color || "#3B82F6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
