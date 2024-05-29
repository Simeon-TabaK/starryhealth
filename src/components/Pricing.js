import React, { useMemo } from "react";
import Image from "next/image";
import ButtonPrimary from "./misc/ButtonPrimary";
import ButtonOutline from "@/components/misc/ButtonOutline.";
import Maps from "../../public/assets/HugeGlobal.svg";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";
import Testimoni from "./Testimoni";
import Link from "next/link";

const Pricing = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  const PRODUCTS = [
    {
      name: "SUPERLIFE TOTAL CARE 30",
      image: "/assets/products/stc30.JPG",
      description:
        "Libérez le potentiel de guérison ❤‍🩹 de votre corps dès aujourd’hui !",
      link: "/products/stc",
    },
    {
      name: "SUPERLIFE COLON CARE",
      image: "/assets/products/scc.JPG",
      description:
        "Une formulation révolutionnaire à base de cellules souches de pomme et de raisin.",
      link: "/product/scc",
    },
    {
      name: "SUPERLIFE IMMUNE CARE",
      image: "/assets/products/sic.JPG",
      description: "Renforcez votre immunité avec SuperLife Immune Care ! 🌿💪",
      link: "/products/sic",
    },
  ];
  const PRODUCTS1 = [
    {
      name: "SUPERLIFE NEURON CARE",
      image: "/assets/products/snc.JPG",
      description:
        "Une formulation révolutionnaire à base de cellules souches de pomme et de raisin.",
      link: "/products/snc",
    },
    {
      name: "SUPER ROOT COFFEE",
      image: "/assets/products/src.JPG",
      description: "☕ Élevez vos matinées avec Super Root Coffee !",
      link: "/products/src",
    },
    {
      name: "SUPER CELLTEC ESSENCE MIST",
      image: "/assets/products/scem.JPG",
      description:
        "Une formulation révolutionnaire à base de cellules souches de pomme et de raisin.",
      link: "/products/sce",
    },
  ];

  return (
    <div
      className="bg-gradient-to-b from-white-300 to-white-500 w-full py-14 mt-20 "
      id="pricing"
    >
      <div className=" px-6 md:px-8 lg:px-16 mx-auto flex flex-col w-full text-center justify-center">
        <div className="flex flex-col w-full">
          <ScrollAnimationWrapper className="pricing">
            <motion.h3
              variants={scrollAnimation}
              className="text-2xl md:text-3xl lg:text-4xl font-medium text-black-600 leading-relaxed"
            >
              Découvrez notre gamme des produits
            </motion.h3>
            <motion.p
              variants={scrollAnimation}
              className="leading-normal w-10/12 md:w-7/12 lg:w-6/12 mx-auto my-2 text-center"
            >
              <span className="italic">
                Faites confiance a nos produits pour le traitement de tout vos
                problèmes de sante.
              </span>
              <br />
              La synergie de nos produits est souvent reconnue pour différents
              cas de maladie enfin d’assurer l’efficacité et un traitement plus
              dans un délai raisonnable
            </motion.p>
          </ScrollAnimationWrapper>
          <div className="grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-3 gap-4 lg:gap-12 py-8 lg:py-12 px-6 md:px-0 lg:px-6">
            {PRODUCTS.map((item) => (
              <ScrollAnimationWrapper
                className="flex justify-center"
                key={item.name}
              >
                <motion.div
                  variants={scrollAnimation}
                  className="flex flex-col justify-center items-center border-2 border-gray-500 rounded-xl py-4 px-6 lg:px-12 xl:px-20"
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  <div className="p-0 lg:p-0 mt-0 lg:mt-0">
                    <Image
                      className="rounded-md"
                      src={item.image}
                      width={200}
                      height={180}
                      alt=""
                    />
                  </div>
                  <p className="text-lg text-black-600 font-medium capitalize my-2 md:my-7">
                    {item.name}
                  </p>
                  <div>
                    <p>{item.description}</p>
                  </div>
                  <div className="flex flex-col w-full justify-center mb-4 flex-none mt-12">
                    <Link href={item.link} className="mb-4 ">
                      <ButtonOutline>Voir plus</ButtonOutline>
                    </Link>
                    <Link href="https://wa.me/+243893926051">
                      <ButtonPrimary>Achetez</ButtonPrimary>
                    </Link>
                  </div>
                </motion.div>
              </ScrollAnimationWrapper>
            ))}
          </div>
          <div className="grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-3 gap-4 lg:gap-12 py-8 lg:py-12 px-6 md:px-0 lg:px-6">
            {PRODUCTS1.map((item) => (
              <ScrollAnimationWrapper
                className="flex justify-center"
                key={item.name}
              >
                <motion.div
                  variants={scrollAnimation}
                  className="flex flex-col justify-center items-center border-2 border-gray-500 rounded-xl py-4 px-6 lg:px-12 xl:px-20"
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  <div className="p-0 lg:p-0 mt-0 lg:mt-0">
                    <Image src={item.image} width={200} height={180} alt="" />
                  </div>
                  <p className="text-lg text-black-600 font-medium capitalize my-2 md:my-7">
                    {item.name}
                  </p>
                  <div>
                    <p>{item.description}</p>
                  </div>
                  <div className="flex flex-col w-full justify-center mb-4 flex-none mt-12">
                    <Link href={item.link} className="mb-4 ">
                      <ButtonOutline>Voir plus</ButtonOutline>
                    </Link>
                    <Link href="https://wa.me/+243893926051">
                      <ButtonPrimary>Achetez</ButtonPrimary>
                    </Link>
                  </div>
                </motion.div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full my-16" id="testimoni">
          <ScrollAnimationWrapper className="pricing">
            <motion.h3
              variants={scrollAnimation}
              className="text-2xl md:text-3xl lg:text-4xl font-medium text-black-600 leading-normal w-9/12 md: lg:w-4/12 mx-auto"
            >
              Des clients satisfaits nous font confiance{" "}
            </motion.h3>
            <motion.p
              variants={scrollAnimation}
              className="leading-normal mx-auto mb-2 mt-4 w-10/12 md:w-7/12 lg:w-6/12"
            >
              Voici les histoires de nos clients qui nous ont rejoints avec{" "}
              <br />
              Grand plaisir lors de l’utilisation de cette fonctionnalité folle
              .
            </motion.p>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper className="w-full flex flex-col py-12">
            <motion.div variants={scrollAnimation}>
              <Testimoni />
            </motion.div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper className="relative w-full mt-16">
            <motion.div variants={scrollAnimation} custom={{ duration: 3 }}>
              <div className="absolute rounded-xl  py-8 md:py-14 px-6 md:px-12 lg:px-16 w-full flex flex-col md:flex-row justify-between items-center z-10 bg-white-500">
                <div className="flex flex-col text-left w-10/12 md:w-7/12 lg:w-5/12 mb-6 md:mb-0">
                  <h5 className="text-black-600 text-lg md:text-xl lg:text-xl leading-relaxed font-medium">
                    Abonnez-vous maintenant pour <br /> Bénéficiez de
                    fonctionnalités spéciales!
                  </h5>
                  <p>Abonnez-vous avec nous et trouvez le plaisir.</p>
                </div>
                <a href="https://wa.me/+243893926051">
                  <ButtonPrimary>Commencez maintenant</ButtonPrimary>
                </a>
              </div>
              <div
                className="absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-60 md:h-56 top-0 mt-8 mx-auto left-0 right-0"
                style={{ filter: "blur(114px)" }}
              ></div>
            </motion.div>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
