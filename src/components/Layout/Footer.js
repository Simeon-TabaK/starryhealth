import React from "react";
import Facebook from "../../../public/assets/Icon/facebook.svg";
import Twitter from "../../../public/assets/Icon/twitter.svg";
import Instagram from "../../../public/assets/Icon/instagram.svg";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-orange-100 pt-44 pb-24">
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
          <Image
            src="/assets/logoStarry.png"
            width={80}
            height={60}
            alt="Free Plan"
          />
          <p className="mb-4">
            <strong className="font-medium">Starry Digital</strong> développe
            des solutions numériques de qualité pour la croissance de votre
            entreprise dans le but de vous assurer une sécurité de travail .
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
            ©{new Date().getFullYear()} - StarryBoxx
          </p>
        </div>
        <div className=" row-span-2 sm:col-span-2 sm:col-start-7 sm:col-end-9 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Produit</p>
          <ul className="text-black-500 ">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Télécharger{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Prix{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Lieux{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Serveur{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Pays{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Blog{" "}
            </li>
          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">
            <span className="uppercase">à</span> propos
          </p>
          <ul className="text-black-500">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              StarryBoxx ?{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Starry Digital{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Politique{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Condition{" "}
            </li>
          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-11 sm:col-end-13 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Contacts</p>
          <ul className="text-black-500">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              +243 999 999 999
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              adresse-mail
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Web
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;