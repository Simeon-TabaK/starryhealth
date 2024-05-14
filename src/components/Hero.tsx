import React, { useMemo } from "react";
import Image from "next/image";
import ButtonPrimary from "./misc/ButtonPrimary";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";
import EmblaCarousel from "./Slide";
import { EmblaOptionsType } from 'embla-carousel'

const Hero = ({
  listUser = [
    {
      name: "Equipe",
      number: "5",
      icon: "/assets/Icon/heroicons_sm-user.svg",
    },
    {
      name: "Goma",
      number: "4",
      icon: "/assets/Icon/gridicons_location.svg",
    },
    {
      name: "Services",
      number: "3",
      icon: "/assets/Icon/bx_bxs-server.svg",
    },
  ],
}) => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);
  const OPTIONS: EmblaOptionsType = {};
  // const SLIDE_COUNT = 5;
  // const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  let SLIDES = [
    // "/assets/logo.png",
    "https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_0rWvumyST3jwTlWdO88YL4CT1OuovQcHLwhymlmfurLCqekh5l7XHZV-A8O_aUBeLzE&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeatZ3nkxayRGgpV5CTjM5SIkkuUdInheBkc3n30Eo4Q&s",
  ];

  return (
    <div className="mt-20 ">
      <ScrollAnimationWrapper children={undefined} className={undefined}>
        <motion.div
          className="gap-8 py-2 sm:py-12"
          // variants={scrollAnimation}
        >
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </motion.div>
      </ScrollAnimationWrapper>
      <div className="relative w-full flex">
        <ScrollAnimationWrapper className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-white-500 z-10">
          {listUser.map((listUsers, index) => (
            <motion.div
              className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
              key={index}
              custom={{ duration: 2 + index }}
              variants={scrollAnimation}
            >
              <div className="flex mx-auto w-40 sm:w-auto">
                <div className="flex items-center justify-center bg-orange-100 w-12 h-12 mr-6 rounded-full">
                  <img src={listUsers.icon} className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl text-black-600 font-bold">
                    {listUsers.number}+
                  </p>
                  <p className="text-lg text-black-500">{listUsers.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </ScrollAnimationWrapper>
        <div
          className="absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
          style={{ filter: "blur(114px)" }}
        ></div>
      </div>
    </div>
  );
};

export default Hero;
