import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/context";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Cart } from "@/components/cart";
import { getCurrentTenant, getServicesForTenant } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { ScrollToTop } from "@/components/scroll-to-top";
import { TenantFavicon } from "@/components/tenant-favicon";
import { ThemeUserSync } from "@/components/theme-user-sync";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  const config = tenant?.config as any;
  let customFavicon = config?.favicon?.trim() || config?.orgLogo?.trim() || null;
  if (!customFavicon && tenant?.user?.id) {
    try {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT "favicon", "orgLogo" FROM "TenantConfig" WHERE "userId" = $1 LIMIT 1;`,
        tenant.user.id
      );
      if (rows && rows[0]) {
        customFavicon = rows[0].favicon || rows[0].orgLogo || null;
      }
    } catch {}
  }
  const orgName = config?.orgName || tenant?.user?.name || null;
  const title = orgName
    ? `${orgName} | Vitrine Santé & Bien-être`
    : "Starry Health | Produits de Santé et Bien-être";
  const description =
    config?.orgDescription ||
    "Leader global dans la promotion de la santé et le bien-être de l'humanité par l'utilisation des produits lisses, testés et approuvés scientifiquement.";

  const cacheKey = customFavicon
    ? encodeURIComponent(customFavicon.slice(-8).replace(/[^a-zA-Z0-9]/g, ""))
    : "";
  const versionedFavicon = customFavicon
    ? (customFavicon.includes("?") ? `${customFavicon}&v=${cacheKey}` : `${customFavicon}?v=${cacheKey}`)
    : null;

  const icons = versionedFavicon
    ? {
        icon: [
          { url: versionedFavicon, type: "image/png" },
        ],
        shortcut: versionedFavicon,
        apple: versionedFavicon,
      }
    : {
        icon: [
          { url: "/assets/logo.png", type: "image/png" },
          { url: "/favicon.ico" },
        ],
        shortcut: "/assets/logo.png",
        apple: "/assets/logo.png",
      };

  const ogImages = versionedFavicon
    ? [{ url: versionedFavicon, width: 512, height: 512, alt: orgName || "Logo" }]
    : [
        {
          url: "/assets/logo.png",
          width: 800,
          height: 800,
          alt: "Starry Health Logo",
        },
      ];

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || "https://sboxx.site"),
    title,
    description,
    icons,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: "/",
      siteName: orgName || "Starry Health",
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getCurrentTenant();
  const config = tenant?.config as any;
  const primaryColor =
    tenant?.user?.primaryColor || config?.headerColor || "#0f766e";
  const secondaryColor = config?.secondaryColor || "#134e4a";
  const accentColor = config?.accentColor || "#10b981";
  const headerColor = config?.headerColor || "#ffffff";
  const footerColor = config?.footerColor || "#0f172a";
  const buttonColor = config?.buttonColor || primaryColor;
  const fontFamily = config?.fontFamily;
  const services = await getServicesForTenant(tenant?.user?.id);
  let customFavicon = config?.favicon?.trim() || config?.orgLogo?.trim() || null;
  if (!customFavicon && tenant?.user?.id) {
    try {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT "favicon", "orgLogo" FROM "TenantConfig" WHERE "userId" = $1 LIMIT 1;`,
        tenant.user.id
      );
      if (rows && rows[0]) {
        customFavicon = rows[0].favicon || rows[0].orgLogo || null;
      }
    } catch {}
  }
  const cacheKey = customFavicon
    ? encodeURIComponent(customFavicon.slice(-8).replace(/[^a-zA-Z0-9]/g, ""))
    : "";
  const versionedFavicon = customFavicon
    ? (customFavicon.includes("?") ? `${customFavicon}&v=${cacheKey}` : `${customFavicon}?v=${cacheKey}`)
    : "/assets/logo.png";

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('starry-theme')||'light';if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <link rel="icon" href={versionedFavicon} type="image/png" sizes="any" />
        <link rel="shortcut icon" href={versionedFavicon} />
        <link rel="apple-touch-icon" href={versionedFavicon} />
        <style>{`
          :root {
            --tenant-primary: ${primaryColor};
            --tenant-secondary: ${secondaryColor};
            --tenant-accent: ${accentColor};
            --tenant-header: ${headerColor};
            --tenant-footer: ${footerColor};
            --tenant-button: ${buttonColor};
            ${fontFamily ? `--font-sans: '${fontFamily}', sans-serif;` : ""}
          }
          ${fontFamily ? `body { font-family: '${fontFamily}', sans-serif !important; }` : ""}
        `}</style>
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <SessionProvider>
              <TenantFavicon faviconUrl={customFavicon} />
              <ThemeUserSync />
              <Navbar tenant={tenant} primaryColor={primaryColor} />
              <main className="flex-1">{children}</main>
              <Footer tenant={tenant} services={services} />
              <ScrollToTop />
              {/* Cart drawer — available on all pages, opened via NavbarCartButton */}
              <Cart
                whatsapp={tenant?.user?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+243969131138"}
                primaryColor={primaryColor}
                vendorName={tenant?.config?.orgName || tenant?.user?.name || "Starry Health"}
              />
            </SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
