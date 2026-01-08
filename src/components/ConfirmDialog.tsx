import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "확인",
  message = "정말로 이 작업을 수행하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm md:items-center md:p-4"
      onClick={handleBackdropClick}
    >
      {/* 다이얼로그 */}
      <div className="animate-in fade-in zoom-in flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl duration-200 md:max-h-[90vh] md:max-w-md md:rounded-3xl">
        {/* 헤더 */}
        <header className="flex items-center justify-between border-b p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 md:h-10 md:w-10">
              <AlertTriangle className="h-4 w-4 text-red-600 md:h-5 md:w-5" />
            </div>
            <h2 className="text-lg font-bold md:text-xl">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </header>

        {/* 본문 */}
        <div className="flex-1 space-y-6 overflow-y-auto p-4 md:space-y-8 md:p-8">
          <p className="leading-relaxed text-gray-700">{message}</p>
        </div>

        {/* 푸터 */}
        <footer className="flex gap-3 border-t bg-gray-50 p-4 md:gap-4 md:p-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100 md:py-4 md:text-base"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-[2] rounded-2xl bg-red-600 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-red-700 active:scale-[0.98] md:py-4 md:text-base"
          >
            {confirmText}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmDialog;
