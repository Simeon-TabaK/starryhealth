"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, Menu, X, ShieldCheck, User as UserIcon, LayoutDashboard, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  tenant?: {
    isTenant: boolean;
    slug: string | null;
    user?: {
      name: string | null;
      primaryColor: string;
      contactPhone: string | null;
      whatsapp: string | null;
    } | null;
  } | null;
}

export function Navbar({ tenant }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isTenant = tenant?.isTenant;
  const vendorName = tenant?.user?.name || tenant?.slug;
  const primaryColor = tenant?.user?.primaryColor || "#0f766e";

  const tenantQuery = isTenant && tenant?.slug ? `?tenant=${tenant.slug}` : "";

  const navLinks = [
    { href: `/${tenantQuery}`, label: "Accueil" },
    { href: `/produits${tenantQuery}`, label: "Produits" },
    { href: `/temoignages${tenantQuery}`, label: "Témoignages" },
    { href: `/a-propos${tenantQuery}`, label: "À Propos" },
    { href: `/contacts${tenantQuery}`, label: "Contacts" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand & Logo */}
          <Link href={`/${tenantQuery}`} className="flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"

            >
              <img className="rounded-xl" src="/assets/logo.png" alt="SH" width={40} height={40} />

            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Starry <span style={{ color: primaryColor }}>Health</span>
              </span>
              <span className="text-[10px] tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block -mt-1 uppercase">
                by Oqata
              </span>
            </div>
          </Link>

          {/* Tenant Badge if visiting via vendor subdomain/slug */}
          {isTenant && (
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-slate-900 border border-emerald-500/30 text-xs font-medium text-slate-700 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Boutique Partenaire: <strong className="text-emerald-700 dark:text-emerald-300">{vendorName}</strong></span>
            </div>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href.split("?")[0];
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                    ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/90 font-semibold shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isTenant && tenant?.user?.whatsapp && (
              <a
                href={`https://wa.me/${tenant.user.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Contact Vendeur
              </a>
            )}

            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-transform hover:scale-105"
              >
                <LayoutDashboard className="w-4 h-4" />
                Tableau de bord
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {isTenant && (
            <div className="p-3 mb-3 rounded-lg bg-emerald-50 dark:bg-slate-900 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Distributeur Agréé: <strong className="text-emerald-700 dark:text-emerald-300">{vendorName}</strong></span>
            </div>
          )}
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
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {session ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-sm font-medium bg-emerald-600 text-white"
              >
                Mon Tableau de Bord
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                Espace Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
