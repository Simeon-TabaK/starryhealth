import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ArchiveBoxIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  ExclamationCircleIcon,
  FingerPrintIcon,
  HomeIcon,
  PhoneIcon,
  RectangleStackIcon,
  StopCircleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const SideBar = () => {

  const links = [
    {
      name: "Admin",
      description: "Page d'accueil",
      href: "/",
      icon: HomeIcon,
    },
    {
      name: "Admin",
      description: "Page de Produit",
      href: "/products",
      icon: BuildingStorefrontIcon,
    },
    {
      name: "Admin",
      description: "Page de témoignage",
      href: "/testmony",
      icon: RectangleStackIcon,
    },
    {
      name: "Admin",
      description: "Page d'a propos",
      href: "/about",
      icon: ExclamationCircleIcon,
    },
    {
      name: "Admin",
      description: "Page de contact",
      href: "/contact",
      icon: PhoneIcon,
    },
  ];
  return (
    <>
      <header
        className={
          "fixed top-0 w-full  z-10 bg-white-500 transition-all " +
          (scrollActive ? " shadow-md pt-0" : " pt-2")
        }
      >
        <nav className="px-6 sm:px-8 lg:px-16 mx-auto flex justify-between py-2 ">
          <div className="col-start-1 col-end-2 flex items-center">
            <Image src="/assets/logo.png" width={80} height={60} alt="" />
          </div>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black-500  items-center">
            {links.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className={
                  "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (currentPathLink === item.href
                    ? " text-red-500 animation-active "
                    : " text-black-500 hover:text-red-500 a")
                }
              >
                {item.name}
              </Link>
            ))}
          </ul>
          {/* <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <Link
              href="/"
              className="text-black-600 mx-2 sm:mx-4 capitalize tracking-wide hover:text-red-500 transition-all"
            >
                <UserIcon className="h-6 w-6 text-blue-500"/>
            </Link>
          </div> */}
        </nav>
      </header>

      {/* Mobile Navigation */}

      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t ">
        <div className="bg-white-500 sm:px-3">
          <ul className="flex w-full justify-between items-center text-black-500">
            {links.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className={
                  "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all" +
                  (currentPathLink === item.href
                    ? "  border-red-500 text-red-500"
                    : " border-transparent")
                }
              >
                <item.icon
                  className={
                    "h-6 w-6 text-gray-600  group-hover:text-indigo-600" +
                    (currentPathLink === item.href
                      ? " text-red-500"
                      : " text-blue-500")
                  }
                  aria-hidden="true"
                  // fill="solid"
                />
                {item.name}
              </Link>
            ))}
          </ul>
        </div>
      </nav>
      {/* End Mobile Navigation */}
    </>
  );
};

export default SideBar;
