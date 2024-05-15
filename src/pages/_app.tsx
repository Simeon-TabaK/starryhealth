import "@/styles/globals.css";
import "@/styles/embla.css";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SeoHead title="SuperLife" />
      <Layout children={<Component {...pageProps} />}></Layout>
    </>
  );
}
