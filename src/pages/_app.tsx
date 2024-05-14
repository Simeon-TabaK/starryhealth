import "@/styles/globals.css";
import "@/styles/embla.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout/Layout";
import SeoHead from "@/components/SeoHead";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SeoHead title="SuperLife" />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
