import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Cart } from "@/components/cart";
import { getCurrentTenant, getServicesForTenant } from "@/lib/tenant";
import { ScrollToTop } from "@/components/scroll-to-top";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://starryhealth.com"),
  title: "Starry Health | Produits de Santé et Bien-être",
  description:
    "Leader global dans la promotion de la santé et le bien-être de l'humanité par l'utilisation des produits lisses, testés et approuvés scientifiquement.",
  icons: {
    icon: [
      { url: "/assets/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Starry Health",
    title: "Starry Health | Produits de Santé et Bien-être",
    description:
      "Leader global dans la promotion de la santé et le bien-être de l'humanité par l'utilisation des produits lisses, testés et approuvés scientifiquement.",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 800,
        alt: "Starry Health Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Starry Health | Produits de Santé et Bien-être",
    description:
      "Leader global dans la promotion de la santé et le bien-être de l'humanité par l'utilisation des produits lisses, testés et approuvés scientifiquement.",
    images: ["/assets/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getCurrentTenant();
  const primaryColor =
    tenant?.config?.headerColor || tenant?.user?.primaryColor || "#0f766e";
  const fontFamily = tenant?.config?.fontFamily;
  const services = await getServicesForTenant(tenant?.user?.id);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --tenant-primary: ${primaryColor};
            ${fontFamily ? `--font-sans: '${fontFamily}', sans-serif;` : ""}
          }
          ${fontFamily ? `body { font-family: '${fontFamily}', sans-serif !important; }` : ""}
        `}</style>
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <SessionProvider>
            <Navbar tenant={tenant} primaryColor={primaryColor} />
            <main className="flex-1">{children}</main>
            <Footer tenant={tenant} services={services} />
            <ScrollToTop />
            {/* Cart drawer — available on all pages, opened via NavbarCartButton */}
            <Cart
              whatsapp={tenant?.user?.whatsapp}
              primaryColor={primaryColor}
              vendorName={tenant?.config?.orgName || tenant?.user?.name || "Starry Health"}
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
