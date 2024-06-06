import React, { useMemo } from "react";
import Maps from "../../public/assets/HugeGlobal.svg";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";

const Partenal = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div className="bg-gradient-to-b from-white-300 to-white-500 w-full py-14">
      <div className=" px-6 sm:px-8 lg:px-16 mx-auto flex flex-col w-full text-center justify-center">
        <div className="flex flex-col w-full">
        </div>
        <div className="flex flex-col w-full my-16">
          <ScrollAnimationWrapper className='partenal'>
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
            <motion.div className="w-full flex justify-evenly items-center mt-4 flex-wrap lg:flex-nowrap" variants={scrollAnimation}>
              <img
                src="/assets/logoSuperLife.png"
                className="h-14 w-auto mt-4 lg:mt-2"
                alt=""
              />
              <img
                src="/assets/logoSuperLife.png"
                className="h-14 w-auto mt-2 lg:mt-0"
                alt=""
              />
              <img
                src="/assets/logoStarry.png"
                className="h-12 w-auto mt-2 lg:mt-0"
                alt=""
              />
              <img
                src="/assets/logoSuperLife.png"
                className="h-14 w-auto mt-2 lg:mt-0"
                alt=""
              />
              <img
                src="/assets/logoSuperLife.png"
                className="h-12 w-auto mt-2 lg:mt-0"
                alt=""
              />
            </motion.div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper className="partenal">
            <motion.div
              className="py-12 w-full px-8 mt-16"
              variants={scrollAnimation}
            >
              <Maps className="w-full h-auto" />
            </motion.div>
          </ScrollAnimationWrapper>
        
        </div>
      </div>
    </div>
  );
};

export default Partenal;
