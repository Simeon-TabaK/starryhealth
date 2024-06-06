import React, { useMemo } from "react";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";
import SimpleSlider from "@/components/Slide";
import Carousel from "@/components/Carousel";
// import EmblaCarousel from "./Slide";
// import { EmblaOptionsType } from 'embla-carousel'

const Hero = ({
  listUser = [
    {
      name: "Equipe",
      number: "5",
      icon: "/assets/Icon/heroicons_sm-user.svg",
    },
    {
      name: "RDC",
      number: "7",
      icon: "/assets/Icon/gridicons_location.svg",
    },
    {
      name: "Témoignages",
      number: "3",
      icon: "/assets/Icon/bx_bxs-server.svg",
    },
  ],
}) => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div className="mt-8">
      <ScrollAnimationWrapper className="slider-0">
        <motion.div
          className="gap-8 py-2 sm:py-12"
        >
          <Carousel />
        </motion.div>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper className="home">
        <motion.h3
          variants={scrollAnimation}
          className="text-xl sm:text-xl lg:text-2xl font-medium text-black-600 leading-relaxed w-full flex justify-center mt-10 mx-auto"
        >
          Bienvenu à Starry Health{" "}
        </motion.h3>
        <motion.p
          className="leading-normal  mx-auto my-2 w-10/12 sm:w-7/12 lg:w-6/12"
          variants={scrollAnimation}
        >
          Leader global dans la promotion de la santé et le bien être de
          l'humanité par m'utilisation des produits lis; testés et approuvées
          scientifiquement
        </motion.p>
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
                <div className="flex items-center justify-center bg-white-300 w-12 h-12 mr-6 rounded-full">
                  <img src={listUsers.icon} className="h-6 w-6 fill-red-500" />
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
      <ScrollAnimationWrapper className="home">
        <motion.h3
          variants={scrollAnimation}
          className="text-xl sm:text-xl lg:text-2xl font-medium text-black-600 leading-relaxed w-full flex justify-center mx-auto"
        >
          STC30{" "}
        </motion.h3>
        <motion.p
          className="leading-normal font text-justify mx-auto my-2 w-11/12 sm:w-8/12 lg:w-7/12"
          variants={scrollAnimation}
        >
          <span className="italic flex justify-center text-center ">
            La thérapie cellulaire par cellules souches végétales : un domaine
            en plein essort
          </span>
          <br />
          La thérapie cellulaire par cellules souches végétales, aussi appelée
          phytothérapie cellulaire, est une approche thérapeutique innovante qui
          utilise les cellules souches végétales pour stimuler la régénération
          et la protection des cellules de l'organisme humain.
          <br />
          Contrairement aux cellules souches animales ou humaines, les cellules
          souches végétales ont la capacité de se totipotentes, c'est-à-dire
          qu'elles peuvent se différencier en tous les types de cellules
          végétales. Cette plasticité unique les rend prometteuses pour un large
          éventail d'applications thérapeutiques.
          <br />
          La thérapie cellulaire par cellules souches végétales offre une
          promesse thérapeutique considérable pour un large éventail de maladies
          et de conditions. elle représente une approche innovante et
          prometteuse pour la médecine régénérative.
        </motion.p>
      </ScrollAnimationWrapper>
    </div>
  );
};

export default Hero;
