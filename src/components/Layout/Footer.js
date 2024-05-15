import React from "react";
import Facebook from "../../../public/assets/Icon/facebook.svg";
import Twitter from "../../../public/assets/Icon/twitter.svg";
import Instagram from "../../../public/assets/Icon/instagram.svg";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";

const Footer = () => {
  return (
    <div className="bg-blue-300 pt-32">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 md:grid-rows-1 grid-flow-row md:grid-flow-col grid-cols-3 ">
        <div className="row-span-2 md:col-span-4 col-start-1 col-end-4 md:col-end-4 flex flex-col items-start ">
          <Image src="/assets/logo1.png" width={80} height={60} alt="" />
          <p className="mb-4 text-white-300">
            <strong className="font-medium">SuperLife</strong> aide dans les
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
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <ArrowRightCircleIcon className="h-6 w-6" /> SUPERLIFE TOTAL CARE
              30{" "}
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <ArrowRightCircleIcon className="h-6 w-6" /> SUPERLIFE COLON CARE{" "}
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <ArrowRightCircleIcon className="h-6 w-6" /> SUPERLIFE IMMUNE CARE{" "}
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <ArrowRightCircleIcon className="h-6 w-6" /> SUPERLIFE NEURON CARE{" "}
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <ArrowRightCircleIcon className="h-6 w-6" /> SUPER ROOT COFFEE{" "}
            </li>
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              <ArrowRightCircleIcon className="h-6 w-6" /> SUPER CELLTEC ESSENCE
              MIST{" "}
            </li>
          </ul>
        </div>
        <div className="row-span-2 md:col-span-2 md:col-start-9 md:col-end-11 flex flex-col">
          <p className="text-red-500 mb-4 font-medium text-lg">
            <span className="uppercase">à</span> propos
          </p>
          <ul className="text-white-300">
            <li className="flex my-2 hover:text-red-500 cursor-pointer transition-all">
              StarryBoxx {" "}
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
