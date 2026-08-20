import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentTenant } from "@/lib/get-current-tenant";
import { ScrollToTop } from "@/components/scroll-to-top";

export const metadata: Metadata = {
  title: "Starry Health | Produits de Santé et Bien-être",
  description:
    "Leader global dans la promotion de la santé et le bien-être de l'humanité par l'utilisation des produits lisses, testés et approuvés scientifiquement.",
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getCurrentTenant();
  const primaryColor = tenant?.user?.primaryColor || "#0f766e";

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --tenant-primary: ${primaryColor};
          }
        `}</style>
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider>
            <Navbar tenant={tenant} />
            <main className="flex-1">{children}</main>
            <Footer tenant={tenant} />
            <ScrollToTop />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
