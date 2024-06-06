import React from "react";
import Facebook from "../../../public/assets/Icon/facebook.svg";
import Twitter from "../../../public/assets/Icon/twitter.svg";
import Instagram from "../../../public/assets/Icon/instagram.svg";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";

const Footer = () => {
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
      link: "/products/scc",
    },
    {
      name: "SUPERLIFE IMMUNE CARE",
      image: "/assets/products/sic.JPG",
      description: "Renforcez votre immunité avec SuperLife Immune Care ! 🌿💪",
      link: "/products/sic",
    },
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
    <div className="bg-blue-300 pt-32">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-16 md:flex justify-between ">
        <div className="row-span-2 md:w-1/4 flex flex-col items-start ">
          <Image src="/assets/logo1.png" width={60} height={60} alt="" />
          <p className="mb-4 text-white-300">
            <strong className="font-medium">Starry Digital</strong> aide dans les
            ventes et marketing des produits medicaux en partenariat avec les
            memebres de SuperLife.
          </p>
          <div className="flex w-full mt-2 mb-8 -mx-2">
            <Link
              href={"https://www.facebook.com"}
              className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md hover:bg-translucide"
            >
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href={"https://www.twitter.com"}
              className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md hover:bg-translucide"
            >
              <Twitter className="h-6 w-6" />
            </Link>
            <Link
              href={"https://www.instagram.com"}
              className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md hover:bg-translucide"
            >
              <Instagram className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-gray-400">
            ©{new Date().getFullYear()} - StarryHealth
          </p>
        </div>
        <div className=" row-span-2 md:col-span-2 md:col-start-5 md:col-end-9 flex flex-col">
          <p className="text-red-500 mb-4 font-medium text-lg">Nos produits</p>
          <ul className="text-white-300 ">
            {PRODUCTS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className="flex my-2 hover:text-red-500 cursor-pointer transition-all"
                >
                  <ArrowRightCircleIcon className="h-6 w-6" /> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="row-span-2 md:col-span-2 md:col-start-9 md:col-end-11 flex flex-col">
          <p className="text-red-500 mb-4 font-medium text-lg">
            <span className="uppercase">à</span> propos
          </p>
          <ul className="text-white-300">
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              Starry Boxx{" "}
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              Starry Digital{" "}
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              Starry Health{" "}
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              SuperLife{" "}
            </li>
          </ul>
        </div>
        <div className="row-span-2 md:col-span-2 md:col-start-11 md:col-end-13 flex flex-col">
          <p className="text-red-500 mb-4 font-medium text-lg">Contacts</p>
          <ul className="text-white-300">
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <a href="tel:+243893926051">+243 893 926 051</a>
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <a href="mailto:starrydigital.sd@gmail.com">
                starryhealth.sd@gmail.com
              </a>
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <a href="https://www.starrybox.vercel.app">
                starryhealth.vercel.app
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
