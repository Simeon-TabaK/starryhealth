import Image from "next/image";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import getScrollAnimation from "@/utils/getScrollAnimation";
import ScrollAnimationWrapper from "@/components/Layout/ScrollAnimationWrapper";
import ButtonOutline from "@/components/misc/ButtonOutline.";

const features = [
  "Beneficiez d'un site professionnel et hebergement annuel sous le control des experts.",
  "Ayez une vitrine d'exposition de vos produit sur le net.",
  "Un tunnel professionnel de generation de prospects, qualification et fidelisation des clients",
  "Maintenance gratuite les deux premiers mois.",
];

const Product = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  const PRODUCT = {
    name: "SUPERLIFE TOTAL CARE 30",
    image: "/assets/products/stc30.JPG",
    description:
      "Libérez le potentiel de guérison ❤‍🩹 de votre corps dès aujourd’hui !",
    link: "/products/stc",
  };

  return (
    <div className="mt-8 mb-6 sm:mt-14 sm:mb-14 px-2 sm:px-2 lg:px-8 mx-auto pt-20">
      <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8 p  y-8 my-12">
        <ScrollAnimationWrapper className="flex w-full justify-end">
          <motion.div
            className="h-full w-full p-1 items-center flex justify-center"
            variants={scrollAnimation}
          >
            <Image
              className="rounded-lg"
              src={PRODUCT.image}
              alt=""
              // layout="responsive"
              quality={100}
              height={320}
              width={320}
            />
          </motion.div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper className="feature">
          <motion.div
            className="flex flex-col items-start justify-center w-full lg:w-9/12"
            variants={scrollAnimation}
          >
            <h3 className="text-3xl lg:text-4xl font-medium leading-relaxed text-black-600">
              {PRODUCT.name}
            </h3>
            <p className="my-2 text-black-500">{PRODUCT.description}</p>
            <ul className="text-black-500 self-start list-inside ml-8">
              {/* {health1.map((health, index) => (
                <motion.li
                  className="relative circle-check custom-list"
                  custom={{ duration: 2 + index }}
                  variants={scrollAnimation}
                  key={health}
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  {health}
                </motion.li>
              ))} */}
            </ul>
            <p className="my-2 text-black-500">
              La santé est ainsi à protéger minutieusement car vous ne saurez à
              quel prix vous pouvez le payer si vous n'en prenez pas soin
              <br />
              Protégez vous avec Superlife et nos produits efficaces
              pour votre bien être
            </p>
            <div className="flex flex-col w-full justify-center mb-4 flex-none mt-12">
              <a href="https://wa.me/+243893926051">
                <ButtonOutline>Passer commande</ButtonOutline>
              </a>
            </div>
          </motion.div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
};

export default Product;
