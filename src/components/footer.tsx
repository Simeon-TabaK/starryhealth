"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Globe, ShieldCheck } from "lucide-react";
import type { TenantContext } from "@/lib/tenant";

interface FooterProps {
  tenant?: TenantContext | null;
  services?: { id: number; name: string; url: string | null }[];
}

export function Footer({ tenant, services = [] }: FooterProps) {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname === "/auth/signin"
  ) {
    return null;
  }

  const isTenant = tenant?.isTenant;
  const vendorName = tenant?.config?.orgName || tenant?.user?.name || tenant?.slug;
  const primaryColor = tenant?.user?.primaryColor || "#0f766e";

  const phone = tenant?.user?.contactPhone || "+243 810 000 000";
  const email = tenant?.user?.contactEmail || "contact@starryhealth.com";
  const address = tenant?.user?.contactAddress || "Kinshasa, RDC & International";
  const website = tenant?.user?.contactWebsite || "www.starryhealth.com";
  const copyright = tenant?.user?.copyright || `© ${new Date().getFullYear()} Starry Health. Tous droits réservés.`;
  const logoSrc = tenant?.config?.orgLogo || "/assets/logo.png";

  // Social links
  const fb = tenant?.user?.facebook;
  const li = tenant?.user?.linkedin;
  const tt = tenant?.user?.tiktok;
  const ig = tenant?.user?.instagram;
  const wa = tenant?.user?.whatsapp;

  const hasSocials = fb || li || tt || ig || wa;

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">

          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <img className="w-full h-full object-contain rounded-2xl" src={logoSrc} alt="Logo" width={56} height={56} />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {tenant?.config?.orgName ? (
                  tenant.config.orgName
                ) : (
                  <>
                    Starry <span style={{ color: primaryColor }}>Health</span>
                  </>
                )}
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {tenant?.config?.orgDescription ||
                "Leader global dans la promotion de la santé et du bien-être de l'humanité grâce aux produits lisses, testés et approuvés scientifiquement."}
            </p>

            {isTenant && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/30 text-xs text-slate-800 dark:text-slate-300 shadow-sm">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" /> Partenaire Agréé
                </span>
                Distributeur: {vendorName}
              </div>
            )}

            {/* Social links with inline SVGs */}
            {hasSocials && (
              <div className="flex items-center gap-2.5 pt-1">
                {fb && (
                  <a
                    href={fb}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {li && (
                  <a
                    href={li}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {ig && (
                  <a
                    href={ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {tt && (
                  <a
                    href={tt}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-8 h-8 rounded-lg bg-black dark:bg-slate-800 flex items-center justify-center text-white hover:opacity-85 transition-opacity text-xs font-bold"
                  >
                    TT
                  </a>
                )}
                {wa && (
                  <a
                    href={`https://wa.me/${wa.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white hover:opacity-85 transition-opacity text-xs font-bold"
                  >
                    WA
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Accueil</Link></li>
              <li><Link href="/produits" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Catalogue Produits</Link></li>
              <li><Link href="/temoignages" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Témoignages Clients</Link></li>
              <li><Link href="/a-propos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">À Propos</Link></li>
              <li><Link href="/contacts" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Direct</Link></li>
            </ul>
          </div>

          {/* Services & Offers (dynamic) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {services.length > 0 ? "Nos Offres & Services" : "Starry Health"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {services.length > 0 ? (
                services.map((s) =>
                  s.url ? (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {s.name}
                      </a>
                    </li>
                  ) : (
                    <li key={s.id}>
                      <span className="text-slate-700 dark:text-slate-300">{s.name}</span>
                    </li>
                  )
                )
              ) : (
                <>
                  <li><span className="text-slate-700 dark:text-slate-300">Starry Health Network</span></li>
                  <li><span className="text-slate-700 dark:text-slate-300">Starry Boxx — Standard</span></li>
                  <li><span className="text-slate-700 dark:text-slate-300">Starry Boxx — Smart</span></li>
                  <li><span className="text-slate-700 dark:text-slate-300">Starry Boxx — Premium</span></li>
                  <li><span className="text-slate-700 dark:text-slate-300">Formations & Accompagnement</span></li>
                </>
              )}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {isTenant ? "Contact Direct" : "Contact Siège Central"}
            </h4>
            <ul className="space-y-3 text-xs">
              {phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{phone}</span>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{email}</span>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{website}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>{copyright}</p>
          <div className="flex gap-6">
            <span>Mentions Légales</span>
            <span>Politique de Confidentialité</span>
            <span>Conditions d'Utilisation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
