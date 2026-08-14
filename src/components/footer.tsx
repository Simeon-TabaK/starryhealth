import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, Globe, ShieldCheck } from "lucide-react";

interface FooterProps {
  tenant?: {
    isTenant: boolean;
    slug: string | null;
    user?: {
      name: string | null;
      primaryColor: string;
      contactPhone: string | null;
      contactEmail: string | null;
      whatsapp: string | null;
    } | null;
  } | null;
}

export function Footer({ tenant }: FooterProps) {
  const isTenant = tenant?.isTenant;
  const vendorName = tenant?.user?.name || tenant?.slug;
  const primaryColor = tenant?.user?.primaryColor || "#0f766e";

  const phone = isTenant ? tenant?.user?.contactPhone || "+243 990 123 456" : "+243 810 000 000";
  const email = isTenant ? tenant?.user?.contactEmail || "vendeur@starryhealth.com" : "contact@starryhealth.com";

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Starry <span style={{ color: primaryColor }}>Health</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Leader global dans la promotion de la santé et du bien-être de l'humanité grâce aux produits lisses, testés et approuvés scientifiquement par <strong>Oqata</strong>.
            </p>
            {isTenant && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/30 text-xs text-slate-800 dark:text-slate-300 shadow-sm">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" /> Partenaire Agréé
                </span>
                Distributeur: {vendorName}
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
              <li><Link href="/a-propos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">À Propos & Starry Boxx</Link></li>
              <li><Link href="/contacts" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Direct</Link></li>
            </ul>
          </div>

          {/* Solution & Services */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Maison Mère & Offres</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-slate-700 dark:text-slate-300">Oqata Network Marketing</span></li>
              <li><span className="text-slate-700 dark:text-slate-300">Starry Boxx - Site Web Pro</span></li>
              <li><span className="text-slate-700 dark:text-slate-300">Starry Boxx - Offre Vitrine</span></li>
              <li><span className="text-slate-700 dark:text-slate-300">Starry Boxx - Tunnel de Vente</span></li>
              <li><span className="text-slate-700 dark:text-slate-300">Formations & Accompagnement</span></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {isTenant ? "Contact Vendeur Direct" : "Contact Siège Central"}
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Kinshasa, RDC & International</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>www.starryhealth.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Starry Health by Oqata. Tous droits réservés.</p>
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
