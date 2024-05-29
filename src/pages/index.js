import Feature from "../components/Feature";
import Hero from "../components/Hero";
import Partenal from "../components/Partenal";
import ContactUs from "../components/ContactUs";

export default function Home() {
  return (
    <>
      <Hero />
      <Feature />
      {/* <FeatureRight /> */}
      <Partenal />
      <ContactUs />
    </>
  );
}
