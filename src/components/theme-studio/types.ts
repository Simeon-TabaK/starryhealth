export type StudioSection =
  | "identity"
  | "colors"
  | "header"
  | "footer"
  | "home"
  | "products"
  | "pages"
  | "media"
  | "advanced";

export type DeviceViewport = "desktop" | "tablet" | "mobile";

export interface ThemeTemplate {
  id: string;
  name: string;
  tagline: string;
  category: "Santé" | "Pharma" | "Nature & Bio" | "Luxe & Spa" | "Moderne";
  previewColors: string[];
  config: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headerColor: string;
    headerTextColor?: string;
    sidebarBgColor: string;
    sidebarTextColor: string;
    footerColor: string;
    footerTextColor?: string;
    dashboardBgColor: string;
    buttonColor: string;
    fontFamily: string;
  };
}

export interface ThemeStudioState {
  // Identité
  orgName: string;
  orgDescription: string;
  orgLogo: string;
  favicon: string;

  // Couleurs
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  buttonColor: string;
  headerColor: string;
  headerTextColor: string;
  footerColor: string;
  footerTextColor: string;
  dashboardBgColor: string;
  sidebarBgColor: string;
  sidebarTextColor: string;
  fontFamily: string;

  // En-tête
  headerStyle: "minimal" | "centered" | "expanded";
  showCartButton: boolean;

  // Pied de page
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactWebsite: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  copyright: string;

  // Page d'accueil & Vitrine
  heroTitle: string;
  heroSubtitle: string;
  heroBannerUrl: string;

  // Catalogue
  cardCornerStyle: "rounded-xl" | "rounded-2xl" | "rounded-none";
  showDiscounts: boolean;
}
