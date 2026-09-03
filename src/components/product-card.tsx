"use client";

import Link from "next/link";
import { ShoppingBag, Tag, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { dispatchAddToCart } from "./cart";

export interface ProductItem {
  id: number;
  name: string;
  description: string;
  defaultPrice: number;
  originalPrice?: number | null;
  effectivePrice: number;
  discountPercent?: number | null;
  isCustomPrice: boolean;
  images: string;
  category: string;
}

interface ProductCardProps {
  product: ProductItem;
  tenantQuery?: string;
  primaryColor?: string;
  onAddToCart?: (product: ProductItem) => void;
}

export function ProductCard({
  product,
  tenantQuery = "",
  primaryColor = "#0f766e",
  onAddToCart,
}: ProductCardProps) {
  const imageList = product.images ? product.images.split(",") : [];
  const mainImage =
    imageList[0] ||
    "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80";

  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const hasOriginalPrice =
    product.originalPrice && product.originalPrice > product.effectivePrice;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      dispatchAddToCart({
        id: product.id,
        name: product.name,
        effectivePrice: product.effectivePrice,
        images: product.images,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-full group shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
          {product.category}
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-md">
            <Percent className="w-3 h-3" /> -{product.discountPercent}%
          </div>
        )}

        {/* VIP Price badge */}
        {product.isCustomPrice && !hasDiscount && (
          <div className="absolute top-3 right-3 bg-sky-600 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-md">
            <Tag className="w-3 h-3" /> Tarif Membre VIP
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-6 flex-1">
          {product.description}
        </p>

        {/* Price & Action Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto gap-2">
          {/* Price Display */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Prix</span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-extrabold" style={{ color: primaryColor }}>
                ${product.effectivePrice.toFixed(2)}
              </span>
              {hasOriginalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAddToCart}
              className="px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
              title="Ajouter au panier et commander"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Commander
            </button>
            <Link
              href={`/produits/${product.id}${tenantQuery}`}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Détails
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
