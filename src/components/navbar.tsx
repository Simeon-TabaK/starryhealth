"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShieldCheck, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { TenantContext } from "@/lib/tenant";

interface NavbarProps {
  tenant?: TenantContext | null;
}

export function Navbar({ tenant }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTenant = tenant?.isTenant;
  const vendorName =
    tenant?.config?.orgName || tenant?.user?.name || tenant?.slug;
  const primaryColor =
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
    pathname === "/auth/signin"
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
          <Link href={`/${tenantQuery}`} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <img
                className="rounded-xl"
                src={logoSrc}
                alt="Logo"
                width={40}
                height={40}
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {tenant?.config?.orgName ? (
                  displayName
                ) : (
                  <>
                    Starry <span style={{ color: primaryColor }}>Health</span>
                  </>
                )}
              </span>
              {isTenant && tenant?.config?.orgName && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-none mt-0.5">
                  by Starry Health
                </span>
              )}
            </div>
          </Link>

          {/* Tenant Badge */}
          {isTenant && (
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-slate-900 border border-emerald-500/30 text-xs font-medium text-slate-700 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Boutique Partenaire:{" "}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {vendorName}
                </strong>
              </span>
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
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "text-slate-900 dark:text-white font-semibold border-b-2 border-emerald-500"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50 rounded-lg"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
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
                Contact
              </a>
            )}
          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
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
          {isTenant && (
            <div className="p-3 mb-3 rounded-lg bg-emerald-50 dark:bg-slate-900 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Distributeur Agréé:{" "}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {vendorName}
                </strong>
              </span>
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
          {isTenant && tenant?.user?.whatsapp && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <a
                href={`https://wa.me/${tenant.user.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 text-white"
              >
                <Phone className="w-4 h-4" />
                Contacter {vendorName}
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
