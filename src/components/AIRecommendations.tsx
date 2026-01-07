import React, { useState } from "react";
import { ClosetItem } from "../types";
// import { getOutfitRecommendations } from "../services/geminiService";
import { Wand2, Loader2, Sparkles, RefreshCcw } from "lucide-react";

interface AIRecommendationsProps {
  items: ClosetItem[];
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ items }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const fetchRecommendations = async () => {
    // if (items.length === 0) return;
    // setLoading(true);
    // try {
    //   const recs = await getOutfitRecommendations(items);
    //   setRecommendations(recs);
    // } catch (error) {
    //   console.error(error);
    //   alert("AI 추천을 가져오는데 실패했습니다.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wand2 className="w-32 h-32" />
        </div>

        <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-black text-gray-900 mb-4">
          AI 스마트 코디 추천
        </h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">
          옷장에 있는 아이템들을 분석하여 오늘 당신을 더욱 빛나게 해줄{" "}
          <br className="hidden md:block" />
          최적의 조합을 제안합니다.
        </p>

        <button
          onClick={fetchRecommendations}
          disabled={loading || items.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-10 py-4 rounded-2xl shadow-lg transition-all hover:-translate-y-1 active:scale-95 flex items-center mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              옷장 분석 중...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-3" />
              {recommendations.length > 0
                ? "다른 스타일 추천받기"
                : "AI에게 추천받기"}
            </>
          )}
        </button>

        {items.length === 0 && (
          <p className="mt-4 text-xs text-red-500 font-medium">
            먼저 옷장에 옷을 등록해주세요!
          </p>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold mb-4">
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {rec.title}
              </h3>
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">
                {rec.combination}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {rec.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
