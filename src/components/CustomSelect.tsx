import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 border-transparent bg-gray-50 bg-white px-4 py-3 text-left text-sm font-medium transition-all hover:border-gray-200 focus:ring-2 focus:ring-blue-500"
      >
        <span className={!selectedOption ? "text-gray-400" : "text-gray-800"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="animate-in fade-in zoom-in absolute z-50 mt-2 max-h-60 w-full origin-top overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-xl duration-100">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-blue-50 ${
                  value === option.value
                    ? "bg-blue-50 font-bold text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              옵션이 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
