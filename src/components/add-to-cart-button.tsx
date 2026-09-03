"use client";

import { ShoppingBag } from "lucide-react";
import { dispatchAddToCart } from "./cart";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    effectivePrice: number;
    images: string;
  };
  primaryColor?: string;
}

export function AddToCartButton({ product, primaryColor = "#0f766e" }: AddToCartButtonProps) {
  return (
    <button
      onClick={() => dispatchAddToCart(product)}
      className="flex-1 py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      style={{ backgroundColor: primaryColor }}
    >
      <ShoppingBag className="w-5 h-5" />
      Ajouter au Panier
    </button>
  );
}
