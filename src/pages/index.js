import Feature from "../components/Feature";
import Pricing from "../components/Pricing";
import Hero from "../components/Hero";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import FeatureRight from "../components/Feature1";
import Partenal from "../components/Partenal";
import ContactUs from "../components/ContactUs";

export default function Home() {
  return (
    <>
      <SeoHead title="Starry Boxx" />
      <Layout>
        {/* <Hero /> */}
        <Feature />
        <FeatureRight />
        <Partenal />
        <ContactUs />
      </Layout>
    </>
  );
}
