import { getCurrentTenant } from "@/lib/get-current-tenant";
import { Phone, Mail, MapPin, Send, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

interface PageProps {
  searchParams?: Promise<{ tenant?: string }>;
}

export default async function ContactsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const tenant = await getCurrentTenant(params.tenant);

  const isTenant = tenant?.isTenant;
  const user = tenant?.user;
  const primaryColor = user?.primaryColor || "#0f766e";

  const phone = isTenant ? user?.contactPhone || "+243 990 123 456" : "+243 810 000 000";
  const email = isTenant ? user?.contactEmail || user?.email || "vendeur@starryhealth.com" : "contact@starryhealth.com";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase">
            <Sparkles className="w-4 h-4" /> Assistance & Contact
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isTenant ? `Contactez votre Conseiller ${user?.name || ""}` : "Contactez le Siège Central Starry Health"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {isTenant
              ? `Posez vos questions ou commandez vos produits directement auprès de votre conseiller agréé.`
              : `Une question sur nos produits ou sur l'opportunité Oqata ? Écrivez-nous et notre équipe vous répondra sous 24h.`}
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Direct Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {isTenant ? "Coordonnées Vendeur" : "Coordonnées Principales"}
              </h3>

              {isTenant && user && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Distributeur Agréé: <strong className="text-emerald-700 dark:text-emerald-300">{user.name}</strong></span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Téléphone / WhatsApp</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{phone}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Adresse Email</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{email}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Localisation</span>
                    <strong className="text-slate-900 dark:text-white text-sm">Kinshasa, République Démocratique du Congo</strong>
                  </div>
                </div>
              </div>

              {isTenant && user?.whatsapp && (
                <a
                  href={`https://wa.me/${user.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 text-xs transition-colors shadow-md"
                >
                  Discuter sur WhatsApp Direct
                </a>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <form className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Envoyer un message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Votre Nom Complet</label>
                  <input
                    type="text"
                    placeholder="Jean Pierre"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Adresse Email</label>
                  <input
                    type="email"
                    placeholder="exemple@domaine.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Sujet de votre demande</label>
                <input
                  type="text"
                  placeholder="Renseignements sur un produit, commande..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Votre Message</label>
                <textarea
                  rows={5}
                  placeholder="Expliquez en détail votre besoin..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                Envoyer le message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </ScrollReveal>

    </div>
  );
}
