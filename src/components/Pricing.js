import React, { useMemo } from "react";
import Image from "next/image";
import Testimoni from "./Testimoni";
import ButtonPrimary from "./misc/ButtonPrimary";
import ButtonOutline from "./misc/ButtonOutline.";
import Maps from "../../public/assets/HugeGlobal.svg";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";

const Pricing = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div
      className="bg-gradient-to-b from-white-300 to-white-500 w-full py-14"
      id="pricing"
    >
      <div className="max-w-screen-xl  px-6 sm:px-8 lg:px-16 mx-auto flex flex-col w-full text-center justify-center">
        <div className="flex flex-col w-full">
          <ScrollAnimationWrapper>
            <motion.h3
              variants={scrollAnimation}
              className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black-600 leading-relaxed"
            >
              Choisir ton plan
            </motion.h3>
            <motion.p
              variants={scrollAnimation}
              className="leading-normal w-10/12 sm:w-7/12 lg:w-6/12 mx-auto my-2 text-center"
            >
              Faites briller votre business avec StarryBoxx.
            </motion.p>
          </ScrollAnimationWrapper>
          <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-12 py-8 lg:py-12 px-6 sm:px-0 lg:px-6">
            <ScrollAnimationWrapper className="flex justify-center">
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
                    src="/assets/Free.png"
                    width={100}
                    height={120}
                    alt="Free Plan"
                  />
                </div>
                <p className="text-lg text-black-600 font-medium capitalize my-2 sm:my-7">
                  StarrySite PRO
                </p>
                <div>
                  <p>
                    Beneficiez d'un site professionnel et hebergement annuel
                    sous le control des experts du domaine... <br />
                    <br /> (Maintenance gratuite les deux premiers mois)
                  </p>
                </div>
                <div className="flex flex-col w-full justify-center mb-4 flex-none mt-12">
                  {/* <p className="text-2xl text-black-600 text-center mb-4 ">
                    Free
                  </p> */}
                  <a href="https://wa.me/+243893926051">
                    <ButtonPrimary>Sélectionnez</ButtonPrimary>
                  </a>
                </div>
              </motion.div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper className="flex justify-center">
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
                    src="/assets/Standard.png"
                    width={100}
                    height={120}
                    alt="Standard Plan"
                  />
                </div>
                <p className="text-lg text-black-600 font-medium capitalize my-2 sm:my-7">
                  StarrySite VITRINE{" "}
                </p>
                <p>
                  Ayez une vitrine d'exposition de vos produit sur le net et
                  repondez au besoin acruel de vos clients grâce à la
                  numerisation fiable de StarryBoxx. <br /> <br />
                  Possiblilité de commande et payement sur la plateforme, il ne
                  vous reste qu'à preparer votre livreur pour son boulot🤷🏻‍♂
                </p>
                <div className="flex flex-col w-full justify-center mb-4 flex-none mt-12">
                  <a href="https://wa.me/+243893926051">
                    <ButtonPrimary>Sélectionnez</ButtonPrimary>
                  </a>
                </div>
              </motion.div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper className="flex justify-center">
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
                    src="/assets/Premium.png"
                    width={145}
                    height={165}
                    alt="Premium Plan"
                  />
                </div>
                <p className="text-lg text-black-600 font-medium capitalize my-2 sm:my-7">
                  StarryFunnel{" "}
                </p>
                <p>
                  Un tunnel professionnel de generation de prospects,
                  qualification et fidelisation des clients... <br /> <br />{" "}
                  Laissez StarryFunnel faire la magie dans votre processus de
                  prospection et vous generer des leads
                </p>
                <div className="flex flex-col w-full justify-center mb-8 flex-none mt-12">
                  <a href="https://wa.me/+243893926051">
                    <ButtonPrimary>Sélectionnez</ButtonPrimary>
                  </a>
                </div>
              </motion.div>
            </ScrollAnimationWrapper>
          </div>
        </div>
        <div className="flex flex-col w-full my-16">
          <ScrollAnimationWrapper>
            <motion.h3
              variants={scrollAnimation}
              className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black-600 leading-relaxed w-9/12 sm:w-6/12 lg:w-4/12 mx-auto"
            >
              L'internet est vaste, ne vous limitez pas...{" "}
            </motion.h3>
            <motion.p
              className="leading-normal  mx-auto my-2 w-10/12 sm:w-7/12 lg:w-6/12"
              variants={scrollAnimation}
            >
              L'internet est un marché vaste et inépuisable, n'hesitez pas
              d'exploiter toutes les potentialités à votre disposition pour
              développer votre activité. <br /> Utilisez votre reseau favorie
              pour atteindre un maximum de prospects et generez des ventes
              automatisées...
              <br /> Vendre n'est plus un souci pour personne StarryBoxx vient
              repondre à vos besoins de prospectionet automatisation de vos
              ventes. Devenez un AS de la vente.
            </motion.p>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper>
            <motion.div
              className="py-12 w-full px-8 mt-16"
              variants={scrollAnimation}
            >
              <Maps className="w-full h-auto" />
            </motion.div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper>
            <motion.div
              className="w-full flex justify-evenly items-center mt-4 flex-wrap lg:flex-nowrap"
              variants={scrollAnimation}
            ></motion.div>
          </ScrollAnimationWrapper>
        </div>
        <div className="flex flex-col w-full my-16" id="testimoni">
          <ScrollAnimationWrapper>
            <motion.h3
              variants={scrollAnimation}
              className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black-600 leading-normal w-9/12 sm: lg:w-4/12 mx-auto"
            >
              Des clients satisfaits nous font confiance{" "}
            </motion.h3>
            <motion.p
              variants={scrollAnimation}
              className="leading-normal mx-auto mb-2 mt-4 w-10/12 sm:w-7/12 lg:w-6/12"
            >
              Voici les histoires de nos clients qui nous ont rejoints avec{" "}
              <br />
              Grand plaisir lors de l’utilisation de cette fonctionnalité folle
              .
            </motion.p>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper className="w-full flex flex-col py-12">
            <motion.div variants={scrollAnimation}>
              {/* <Testimoni /> */}
            </motion.div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper className="relative w-full mt-16">
            <motion.div variants={scrollAnimation} custom={{ duration: 3 }}>
              <div className="absolute rounded-xl  py-8 sm:py-14 px-6 sm:px-12 lg:px-16 w-full flex flex-col sm:flex-row justify-between items-center z-10 bg-white-500">
                <div className="flex flex-col text-left w-10/12 sm:w-7/12 lg:w-5/12 mb-6 sm:mb-0">
                  <h5 className="text-black-600 text-lg sm:text-xl lg:text-xl leading-relaxed font-medium">
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
                className="absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-60 sm:h-56 top-0 mt-8 mx-auto left-0 right-0"
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
