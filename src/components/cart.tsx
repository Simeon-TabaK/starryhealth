"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CartItem {
  id: number;
  name: string;
  effectivePrice: number;
  images: string;
  quantity: number;
}

const CART_KEY = "starry_cart";

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

interface CartProps {
  whatsapp?: string | null;
  primaryColor?: string;
  vendorName?: string | null;
}

export function Cart({ whatsapp, primaryColor = "#0f766e", vendorName }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getStoredCart());

    // Listen for cart updates from ProductCard
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CartItem>).detail;
      setItems((prev) => {
        const existing = prev.find((i) => i.id === detail.id);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.id === detail.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          next = [...prev, { ...detail, quantity: 1 }];
        }
        saveCart(next);
        return next;
      });
      setOpen(true);
    };

    window.addEventListener("starry:add-to-cart", handler);
    return () => window.removeEventListener("starry:add-to-cart", handler);
  }, []);

  const update = useCallback((id: number, delta: number) => {
    setItems((prev) => {
      const next = prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
      saveCart(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveCart(next);
      return next;
    });
  }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.effectivePrice * i.quantity, 0);

  const sendWhatsApp = () => {
    if (!whatsapp) return;
    const phone = whatsapp.replace(/[^0-9]/g, "");
    const lines = items
      .map((i) => `• ${i.name} x${i.quantity} — $${(i.effectivePrice * i.quantity).toFixed(2)}`)
      .join("\n");
    const text = encodeURIComponent(
      `Bonjour${vendorName ? ` ${vendorName}` : ""},\n\nJe souhaite passer la commande suivante :\n\n${lines}\n\n💰 Total : $${totalPrice.toFixed(2)}\n\nMerci de confirmer la disponibilité et les modalités de livraison.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: primaryColor }}
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
            {totalItems}
          </span>
        )}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-slate-950 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800"
                style={{ borderTopColor: primaryColor, borderTopWidth: 3 }}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" style={{ color: primaryColor }} />
                  <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                    Mon Panier
                  </h2>
                  {totalItems > 0 && (
                    <span
                      className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {totalItems}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Votre panier est vide.
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs">
                      Ajoutez des produits depuis le catalogue.
                    </p>
                  </div>
                ) : (
                  items.map((item) => {
                    const img = item.images?.split(",")[0] || "";
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                      >
                        {img && (
                          <img
                            src={img}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold mt-0.5" style={{ color: primaryColor }}>
                            ${(item.effectivePrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => update(item.id, -1)}
                            className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => update(item.id, 1)}
                            className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => remove(item.id)}
                            className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center justify-center transition-colors ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-5 py-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Total</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  {whatsapp ? (
                    <button
                      onClick={sendWhatsApp}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white shadow-xl transition-transform hover:scale-[1.02] active:scale-95"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      Commander via WhatsApp
                    </button>
                  ) : (
                    <p className="text-xs text-center text-slate-400 italic">
                      Aucun numéro WhatsApp vendeur configuré.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/** Helper to dispatch add-to-cart event from ProductCard */
export function dispatchAddToCart(product: Omit<CartItem, "quantity">) {
  window.dispatchEvent(
    new CustomEvent("starry:add-to-cart", { detail: product })
  );
}
