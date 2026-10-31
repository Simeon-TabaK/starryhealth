"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2.5 p-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-[#1A1A8B] dark:text-[#CCAB00]`} />
      {text && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}

