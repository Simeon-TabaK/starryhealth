import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BuildingStorefrontIcon,
  HomeIcon,
  InformationCircleIcon, // Remplace ExclamationCircleIcon qui valait undefined
  PhoneIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

const Header = () => {
  const [scrollActive, setScrollActive] = useState(false);
  const currentPathLink = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrollActive(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    // Nettoyage de l'événement lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    {
      name: "Accueil",
      description: "Page d'accueil",
      href: "/",
      icon: HomeIcon,
    },
    {
      name: "Produits",
      description: "Page de Produit",
      href: "/products",
      icon: BuildingStorefrontIcon,
    },
    {
      name: "Témoignage",
      description: "Page de témoignage",
      href: "/testmony",
      icon: RectangleStackIcon,
    },
    {
      name: "A propos",
      description: "Page d'a propos",
      href: "/about",
      icon: InformationCircleIcon,
    },
    {
      name: "Contacts",
      description: "Page de contact",
      href: "/contact",
      icon: PhoneIcon,
    },
  ];

  return (
    <>
      <header
        className={
          "fixed top-0 w-full z-10 bg-white transition-all " +
          (scrollActive ? " shadow-md pt-0" : " pt-2")
        }
      >
        <nav className="px-6 sm:px-8 lg:px-16 mx-auto flex justify-between py-2">
          <div className="col-start-1 col-end-2 flex items-center">
            <Image src="/assets/logo.png" width={80} height={60} alt="Logo" />
          </div>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black items-center">
            {links.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className={
                  "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative " +
                  (currentPathLink === item.href
                    ? "text-red-500 animation-active"
                    : "text-black hover:text-red-500")
                }
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t">
        <div className="bg-white sm:px-3">
          <ul className="flex w-full justify-between items-center text-black">
            {links.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={
                    "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                    (currentPathLink === item.href
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-gray-600")
                  }
                >
                  <IconComponent
                    className={
                      "h-6 w-6 " +
                      (currentPathLink === item.href
                        ? "text-red-500"
                        : "text-blue-500")
                    }
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </ul>
        </div>
      </nav>
      {/* End Mobile Navigation */}
    </>
  );
};

export default Header;