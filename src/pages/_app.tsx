import "@/styles/globals.css";
// import "@/styles/slide.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SeoHead title="Starry Health" />
      <Layout children={<Component {...pageProps} />}></Layout>
    </>
  );
}
