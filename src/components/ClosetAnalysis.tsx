import React, { useState, useRef } from "react";
// import { getClosetTips } from "../services/geminiService";
import { Camera, Upload, Loader2, ListChecks, ArrowRight } from "lucide-react";

const ClosetAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setTips([]); // Reset tips on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeCloset = async () => {
    if (!image) return;
    // setLoading(true);
    // try {
    //   const result = await getClosetTips(image);
    //   setTips(result);
    // } catch (error) {
    //   console.error(error);
    //   alert("정리 팁을 분석하는 데 실패했습니다.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-2">옷장 정리 도우미</h2>
            <p className="text-gray-500 mb-6 text-sm">
              현재 옷장 상태를 사진으로 찍어주세요. AI가 분석하여 효율적인 정리
              방법을 알려드립니다.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 min-h-[300px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 ${
                image ? "border-none" : "border-gray-200"
              }`}
            >
              {image ? (
                <div className="relative w-full h-full group">
                  <img
                    src={image}
                    alt="Closet Preview"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-3xl transition-opacity">
                    <span className="text-white font-bold bg-black/40 px-4 py-2 rounded-full">
                      사진 교체
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    사진을 업로드하세요
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {image && (
              <button
                onClick={analyzeCloset}
                disabled={loading}
                className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    공간 분석 중...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5 mr-3" />
                    분석 시작하기
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div
            className={`bg-indigo-50 p-8 rounded-3xl border border-indigo-100 min-h-[400px] transition-all ${
              tips.length > 0 ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="flex items-center mb-6">
              <ListChecks className="w-8 h-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-bold text-indigo-900">
                AI의 맞춤형 제안
              </h3>
            </div>

            {tips.length > 0 ? (
              <div className="space-y-6">
                {tips.map((tipObj, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl shadow-sm animate-in slide-in-from-right-4 fade-in duration-300"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-start">
                      <span className="w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mr-3 mt-1">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {tipObj.tip}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {tipObj.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-indigo-400 font-medium">
                  사진을 올리고 분석 버튼을 누르면
                  <br />
                  이곳에 팁이 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosetAnalysis;
