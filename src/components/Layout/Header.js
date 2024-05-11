import React, { useState, useEffect } from "react";
import Link from "next/link";
// Import react scroll
// import { Link } from "react-scroll";
import ButtonOutline from "../misc/ButtonOutline.";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import { usePathname } from "next/navigation";
// import LogoVPN from "../../../public/assets/Logo.svg";

const Header = () => {
  // const [activeLink, setActiveLink] = useState(null);
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
      name: "Produit",
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
      name: "Contact",
      description: "Page de contact",
      href: "/contact",
    },
  ];
  return (
    <>
      <header
        className={
          "fixed top-0 w-full  z-30 bg-transparent transition-all " +
          (scrollActive ? " shadow-md pt-0" : " pt-4")
        }
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-3 sm:py-4">
          <div className="col-start-1 col-end-2 flex items-center">
            <Image
              src="/assets/logoStarry.png"
              width={80}
              height={60}
              alt="Free Plan"
            />
          </div>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black-500  items-center">
            {links.map((item) => (
              <Link
                activeClass="active"
                href={item.href}
                spy={true}
                smooth={true}
                duration={1000}
                className={
                  "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (activeLink === item.href
                    ? " text-orange-500 animation-active "
                    : " text-black-500 hover:text-orange-500 a")
                }
              >
                {item.name}
              </Link>
            ))}
          </ul>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <Link
              href="/"
              className="text-black-600 mx-2 sm:mx-4 capitalize tracking-wide hover:text-orange-500 transition-all"
            >
                Sign In
            </Link>
            <ButtonOutline>Sign Up</ButtonOutline>
          </div>
        </nav>
      </header>
      {/* Mobile Navigation */}

      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t ">
        <div className="bg-white-500 sm:px-3">
          <ul className="flex w-full justify-between items-center text-black-500">
            {links.map((item) => (
              <Link
                activeClass="active"
                href={item.href}
                spy={true}
                smooth={true}
                duration={1000}
                className={
                  "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all" +
                  (activeLink === item.href
                    ? "  border-orange-500 text-orange-500"
                    : " border-transparent")
                }
              >
                {item.name}
              </Link>
            ))}
            {/* <Link
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("about");
              }}
              className={
                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                (activeLink === "about"
                  ? "  border-orange-500 text-orange-500"
                  : " border-transparent")
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About
            </Link> */}
          </ul>
        </div>
      </nav>
      {/* End Mobile Navigation */}
    </>
  );
};

export default Header;
