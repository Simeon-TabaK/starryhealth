"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShieldCheck, Phone, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavbarCartButton } from "@/components/cart";
import { sanitizeWhatsApp, formatWhatsAppUrl } from "@/lib/constants";
import type { TenantContext } from "@/lib/tenant";

interface NavbarProps {
  tenant?: TenantContext | null;
  primaryColor?: string;
}

export function Navbar({ tenant, primaryColor: primaryColorProp }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTenant = tenant?.isTenant;
  const vendorName =
    tenant?.config?.orgName || tenant?.user?.name || tenant?.slug;
  const primaryColor =
    primaryColorProp ||
    tenant?.config?.headerColor ||
    tenant?.user?.primaryColor ||
    "#0f766e";

  const tenantQuery =
    isTenant && tenant?.slug ? `?tenant=${tenant.slug}` : "";

  const navLinks = [
    { href: `/${tenantQuery}`, label: "Accueil" },
    { href: `/produits${tenantQuery}`, label: "Produits" },
    { href: `/temoignages${tenantQuery}`, label: "Témoignages" },
    { href: `/a-propos${tenantQuery}`, label: "À Propos" },
    { href: `/contacts${tenantQuery}`, label: "Contacts" },
  ];

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname === "/auth/signin" ||
    pathname === "/auth/register"
  ) {
    return null;
  }

  const logoSrc = tenant?.config?.orgLogo || "/assets/logo.png";
  const displayName = tenant?.config?.orgName || "Starry Health";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand & Logo */}
          <Link href={`/${tenantQuery}`} className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-transform group-hover:scale-105 bg-transparent dark:bg-transparent">
              <img
                className="w-full h-full object-contain"
                src={logoSrc}
                alt="Logo Starry Health"
                width={64}
                height={64}
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {tenant?.config?.orgName ? (
                  displayName
                ) : (
                  <>
                    Starry <span style={{ color: primaryColor }}>Health</span>
                  </>
                )}
              </span>
            </div>
          </Link>



          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href.split("?")[0];
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-all ${isActive
                    ? "text-slate-900 dark:text-white font-semibold border-b-2 border-emerald-500"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50 rounded-lg"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            {/* Cart button in header */}
            <NavbarCartButton primaryColor={primaryColor} />

          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <NavbarCartButton primaryColor={primaryColor} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">

          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          {(() => {
            const waNumber = sanitizeWhatsApp(tenant?.user?.whatsapp);
            return (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <a
                  href={formatWhatsAppUrl(waNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-emerald-700 text-white hover:bg-emerald-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Contacter {isTenant ? vendorName : "Starry Health"}
                </a>
              </div>
            );
          })()}
        </div>
      )}
    </header>
  );
}
