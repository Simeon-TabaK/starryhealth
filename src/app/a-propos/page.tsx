import { getCurrentTenant } from "@/lib/get-current-tenant";
import { Sparkles, Layers, Globe, CheckCircle2, UserCheck, Heart } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";

interface PageProps {
  searchParams?: Promise<{ tenant?: string }>;
}

export default async function AboutPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const tenant = await getCurrentTenant(params.tenant);

  const isTenant = tenant?.isTenant;
  const user = tenant?.user;
  const primaryColor = user?.primaryColor || "#0f766e";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. Header Banner */}
      <ScrollReveal direction="down">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase">
            <Sparkles className="w-4 h-4" /> Notre Histoire & Vision
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            À Propos de <span style={{ color: primaryColor }}>Starry Health</span> & Oqata
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Pionniers de la santé naturelle et de la technologie web dédiée aux professionnels de la nutrition et aux distributeurs indépendants.
          </p>
        </div>
      </ScrollReveal>

      {/* 2. Dynamic Content: Subdomain Vendor View vs Main Corporate View */}
      {isTenant && user ? (
        /* TENANT / DISTRIBUTOR SPECIFIC PRESENTATION */
        <ScrollReveal direction="up">
          <section className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-3xl font-extrabold text-slate-900 dark:text-white shrink-0 shadow-md">
                {user.name ? user.name.charAt(0) : "V"}
              </div>
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <UserCheck className="w-4 h-4" /> Conseiller & Distributeur Agréé Oqata
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Partenaire Indépendant Starry Health</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Mon Engagement pour votre Santé
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {user.bio ||
                  "Bienvenue sur mon espace personnalisé ! En tant que membre passionné du réseau Oqata & Starry Health, je m'engage au quotidien à vous accompagner vers une vie plus saine grâce aux produits naturels les plus efficaces du marché. N'hésitez pas à me contacter directement pour des conseils personnalisés."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Téléphone Direct</strong>
                <span className="text-slate-600 dark:text-slate-300">{user.contactPhone || "+243 990 123 456"}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Email Professionnel</strong>
                <span className="text-slate-600 dark:text-slate-300">{user.contactEmail || user.email}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">WhatsApp</strong>
                <span className="text-slate-600 dark:text-slate-300">{user.whatsapp || "Non renseigné"}</span>
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : (
        /* MAIN CORPORATE VIEW: Starry Health, Oqata, Starry Boxx */
        <div className="space-y-16">
          
          {/* Starry Health & Oqata */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StaggerItem>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Le Projet Starry Health</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Starry Health est une plateforme moderne dédiée à la vente et la promotion de suppléments nutritionnels, compléments alimentaires et produits de soin biologique haut de gamme. Chaque produit de notre catalogue fait l'objet d'analyses scientifiques rigoureuses.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">La Maison Mère : Oqata</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Oqata est une entreprise internationale de marketing de réseau et d'innovation technologique. Elle propulse des milliers d'entrepreneurs et de distributeurs indépendants à travers le continent en leur fournissant des produits de haute qualité et des outils digitaux avancés.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Starry Boxx Presentation */}
          <ScrollReveal direction="up">
            <section className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-emerald-500/30 space-y-8 shadow-md">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase">
                  <Layers className="w-4 h-4" /> Solution Digitale Exclusive
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">La Boîte à Outils : Starry Boxx</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Starry Boxx est la suite clé-en-main d'hébergement web et de tunnels de vente conçue spécialement pour automatiser l'activité des distributeurs Oqata.
                </p>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Offre 1: Site Web Pro */}
                <StaggerItem>
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold">
                      01
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Offre Site Web Pro</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Site web complet multi-tenant avec sous-domaine personnalisé, catalogue de produits complet, gestion dynamique des prix et espace d'administration complet.
                    </p>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Sous-domaine propre</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Prix personnalisés VIP</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Dashboard Analytics</li>
                    </ul>
                  </div>
                </StaggerItem>

                {/* Offre 2: Vitrine */}
                <StaggerItem>
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-emerald-500/40 space-y-4 relative shadow-sm">
                    <span className="absolute -top-3 right-4 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
                      Recommandé
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-extrabold">
                      02
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Offre Vitrine</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Page de présentation élégante et épurée mettant en avant vos coordonnées directes, vos carrousels personnalisés et vos témoignages clients satisfaits.
                    </p>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Design responsive premium</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Intégration WhatsApp directe</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Thème de couleurs modifiable</li>
                    </ul>
                  </div>
                </StaggerItem>

                {/* Offre 3: Tunnel */}
                <StaggerItem>
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold">
                      03
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Offre Tunnel</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Tunnel de vente ultra-optimisé pour la conversion d'un produit phare avec système de capture de prospects et suivi des commandes.
                    </p>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Maximisation des ventes</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Formulaires rapides</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Support technique dédié</li>
                    </ul>
                  </div>
                </StaggerItem>

              </StaggerContainer>
            </section>
          </ScrollReveal>

        </div>
      )}

    </div>
  );
}
