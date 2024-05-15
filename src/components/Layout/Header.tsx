import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = () => {
  const [scrollActive, setScrollActive] = useState(false);

  const activeLink = usePathname();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);

  const links = [
    {
      name: "Accueil",
      description: "Page d'accueil",
      href: "/",
    },
    {
      name: "Produits",
      description: "Page de Produit",
      href: "/product",
    },
    {
      name: "Témoignage",
      description: "Page de témoignage",
      href: "/testmony",
    },
    {
      name: "A propos",
      description: "Page d'a propos",
      href: "/about",
    },
    {
      name: "Contacts",
      description: "Page de contact",
      href: "/contact",
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
                  (activeLink === item.href
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
                Sign In
            </Link>
            <ButtonOutline>Sign Up</ButtonOutline>
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
                  (activeLink === item.href
                    ? "  border-red-500 text-red-500"
                    : " border-transparent")
                }
              >
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

export default Header;
