"use client";

import Link from "next/link";
import { ShoppingCart, Tag, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export interface ProductItem {
  id: number;
  name: string;
  description: string;
  defaultPrice: number;
  effectivePrice: number;
  isCustomPrice: boolean;
  images: string;
  category: string;
  showPrice: boolean; // Whether to show the price (false when no slug/tenant)
}

interface ProductCardProps {
  product: ProductItem;
  tenantQuery?: string;
  primaryColor?: string;
}

export function ProductCard({ product, tenantQuery = "", primaryColor = "#0f766e" }: ProductCardProps) {
  const imageList = product.images ? product.images.split(",") : [];
  const mainImage = imageList[0] || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80";

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

        {/* Custom Price Badge */}
        {product.showPrice && product.isCustomPrice && (
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
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
          {product.showPrice ? (
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Prix Public</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold" style={{ color: primaryColor }}>
                  ${product.effectivePrice.toFixed(2)}
                </span>
                {product.isCustomPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ${product.defaultPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <EyeOff className="w-4 h-4" />
              <div>
                <span className="text-[11px] font-medium block">Prix masqué</span>
                <span className="text-[10px]">Connectez-vous pour voir les prix</span>
              </div>
            </div>
          )}

          <Link
            href={`/produits/${product.id}${tenantQuery}`}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            Détails <ShoppingCart className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
