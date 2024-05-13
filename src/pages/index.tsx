import Feature from "../components/Feature";
import Pricing from "../components/Pricing";
import Hero from "../components/Hero";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import Slide from "../components/Slide";
import Carousel from "../components/Caousel";
import EmblaCarousel from "../components/Slide";
import TrendingSlider from "../components/Caousel/TrendingSlider";
import { EmblaOptionsType } from 'embla-carousel'

export default function Home() {
  const OPTIONS: EmblaOptionsType = {};
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <>
        {/* <Carousel /> */}
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        {/* <TrendingSlider /> */}
        {/* <Slide /> */}
        <Hero />
        <Feature />
        <Pricing />
    </>
  );
}
