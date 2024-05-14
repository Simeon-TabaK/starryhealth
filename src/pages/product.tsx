import Feature from "../components/Feature";
import Pricing from "../components/Pricing";
// import Hero from "../components/Hero";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import FeatureRight from "@/components/Feature1";

export default function Home() {
  return (
    <>
        {/* <Hero /> */}
        <Feature />
        <FeatureRight />
        <Pricing />
    </>
  );
}