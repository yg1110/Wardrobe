import React from "react";
import { ClosetItem } from "../types";
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
} from "recharts";

interface DashboardProps {
  items: ClosetItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const categoryData = items.reduce((acc: any[], item) => {
    const existing = acc.find((a) => a.name === item.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, []);

  const frequencyData = items
    .filter((i) => i.wornCount > 0)
    .sort((a, b) => b.wornCount - a.wornCount)
    .slice(0, 5)
    .map((i) => ({
      name: i.subCategory || i.category,
      count: i.wornCount,
      color: i.color,
    }));

  const COLORS_PALETTE = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 text-sm font-medium mb-1">총 의류 개수</p>
          <p className="text-4xl font-black text-blue-600">{items.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 text-sm font-medium mb-1">
            이번 달 입은 횟수
          </p>
          <p className="text-4xl font-black text-green-600">
            {items.reduce((sum, item) => sum + item.wornCount, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 text-sm font-medium mb-1">
            가장 많이 입은 옷
          </p>
          <p className="text-lg font-bold text-gray-800">
            {frequencyData[0]?.name || "데이터 없음"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">의류 카테고리 비중</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_PALETTE[index % COLORS_PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">가장 자주 입은 옷 Top 5</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {frequencyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
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
