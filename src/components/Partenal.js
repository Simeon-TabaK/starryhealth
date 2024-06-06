import React, { useMemo } from "react";
import Slider from "react-slick";
import Maps from "../../public/assets/HugeGlobal.svg";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";

const Partenal = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);
  const settings = {
    // dots: true,
    // fade:true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 4000,
    waitForAnimate: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    cssEase: "ease-in-out",
  };
  const paternalLogo = [
    { index: 0, src: "/assets/logoSuperLife.png", text: "Lorem ....", href: "starryboxx.vercel.app" },
    { index: 1, src: "/assets/logo.png", text: "Lorem ....", href: "starryboxx.vercel.app" },
    { index: 2, src: "/assets/logoSuperLife.png", text: "Lorem ....", href: "starryboxx.vercel.app" },
    { index: 3, src: "/assets/logo.png", text: "Lorem ....", href: "starryboxx.vercel.app" },
    { index: 4, src: "/assets/logoSuperLife.png", text: "Lorem ....", href: "starryboxx.vercel.app" },
    { index: 5, src: "/assets/logo.png", text: "Lorem ....", href: "starryboxx.vercel.app" },
  ];

  return (
    <div className="bg-gradient-to-b from-white-300 to-white-500 w-full py-14">
      <div className=" px-6 sm:px-8 lg:px-16 mx-auto flex flex-col w-full text-center justify-center">
        <div className="flex flex-col w-full"></div>
        <div className="flex flex-col w-full my-16">
          <ScrollAnimationWrapper className="partenal">
            <motion.h3
              variants={scrollAnimation}
              className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black-600 leading-relaxed w-9/12 sm:w-6/12 lg:w-4/12 mx-auto"
            >
              Nos partenaire dans les monde{" "}
            </motion.h3>
            <motion.p
              className="leading-normal  mx-auto my-2 w-10/12 sm:w-7/12 lg:w-6/12"
              variants={scrollAnimation}
            >
              Lorem.....
            </motion.p>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper className="partenal">
            <motion.div
              className="w-full flex justify-evenly items-center mt-4 flex-wrap lg:flex-nowrap"
              variants={scrollAnimation}
            >
              <div className="w-9/12">
                <Slider arrows={false} {...settings}>
                  {paternalLogo.map((s) => (
                    <a className="h-24" href={s.href}>
                      <img
                        key={s.index}
                        src={s.src}
                        className="h-24 w-auto mt-4 lg:mt-2 mx-10"
                        alt=""
                      />
                    </a>
                  ))}
                </Slider>
              </div>
            </motion.div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper className="partenal">
            <motion.div
              className="py-2 w-full px-2 mt-2"
              variants={scrollAnimation}
            >
              {/* <Maps className="w-full h-auto" /> */}
              <div className="flex justify-center">
                <img src="/assets/rdc.png" className="w-2/3" alt="" />
              </div>
            </motion.div>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </div>
  );
};

export default Partenal;
