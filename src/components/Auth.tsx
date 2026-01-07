import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Mail, Lock, User, LogIn, UserPlus } from "lucide-react";

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // 더 구체적인 에러 메시지 제공
          if (error.message.includes("Invalid login credentials")) {
            throw new Error(
              "이메일 또는 비밀번호가 올바르지 않습니다. 이메일 확인이 필요할 수 있습니다.",
            );
          }
          throw error;
        }

        // 이메일 확인이 필요한 경우 체크
        if (data.user && !data.user.email_confirmed_at) {
          setError("이메일 확인이 필요합니다. 등록하신 이메일을 확인해주세요.");
          setLoading(false);
          return;
        }

        onAuthSuccess();
      } else {
        // 회원가입
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("이미 등록된 이메일입니다. 로그인을 시도해주세요.");
          }
          if (
            error.code === "email_address_invalid" ||
            error.message.includes("invalid")
          ) {
            throw new Error(
              "이메일 주소가 유효하지 않습니다. 실제 이메일 주소를 사용하거나, Supabase 대시보드에서 이메일 검증 규칙을 확인해주세요.",
            );
          }
          throw error;
        }

        // 이메일 확인이 필요한 경우
        if (data.user && !data.user.email_confirmed_at) {
          alert(
            "회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화해주세요.",
          );
          setIsLogin(true);
          setEmail("");
          setPassword("");
        } else {
          // 이메일 확인이 비활성화된 경우 바로 로그인
          onAuthSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:rounded-3xl md:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? "로그인" : "회원가입"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? "옷장 관리 서비스에 오신 것을 환영합니다"
              : "새 계정을 만들어 시작하세요"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이메일을 입력하세요"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요 (최소 6자)"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              <p className="font-medium">{error}</p>
              {error.includes("이메일 확인") && (
                <p className="mt-2 text-xs text-red-500">
                  Supabase 대시보드에서 이메일 확인을 비활성화하거나, 등록하신
                  이메일의 확인 링크를 클릭해주세요.
                </p>
              )}
              {error.includes("이메일 주소가 유효하지 않습니다") && (
                <div className="mt-2 space-y-1 text-xs text-red-500">
                  <p>
                    개발 환경에서는 Supabase 대시보드에서 다음 설정을
                    확인하세요:
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>
                      Authentication → Settings → Email Auth → "Enable email
                      confirmations" 비활성화
                    </li>
                    <li>
                      Authentication → Settings → Email Auth → "Secure email
                      change" 비활성화
                    </li>
                    <li>
                      또는 실제 이메일 주소 사용 (예: gmail.com, naver.com 등)
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                처리 중...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                {isLogin ? (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    로그인
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    회원가입
                  </>
                )}
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setEmail("");
              setPassword("");
            }}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            {isLogin
              ? "계정이 없으신가요? 회원가입"
              : "이미 계정이 있으신가요? 로그인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
