import React, { useState, useEffect } from "react";
import Link from "next/link";
// Import react scroll
import { Link as LinkScroll } from "react-scroll";
import ButtonOutline from "../misc/ButtonOutline.";
import Image from "next/image";
import {
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  HomeIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

const links = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#home",
    icon: HomeIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#home",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers' data will be safe and secure",
    href: "#feature",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#pricing",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#testimoni",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

const Header = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [scrollActive, setScrollActive] = useState(false);

  const [displayUp, setDisplayUp] = useState("block");
  const [displayDown, setDisplayDown] = useState("none");

  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  function handleClickDisplay() {
    setDisplayDown("block");
    setDisplayUp("none");
  }

  function handleClickUndisplay() {
    setDisplayDown("none");
    setDisplayUp("block");
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);
  return (
    <>
      <div className="flex fixed top-0 h-full w-50  z-50 bg-transparent transition-all flex-row justify-center ">
        <nav className="content-center">
          <div
            // onClick={setDisplayDown("block")}
            style={{ display: displayUp }}
            className="bg-translucide py-1 cursor-pointer duration-300 text-white  border border-transparent hover:border-main-color rounded-full  transition-300"
          >
            <button onMouseEnter={handleClickDisplay}>
              <ChevronUpIcon
                className="h-10 w-10 text-gray-600 text-blue-500 group-hover:text-indigo-600"
                aria-hidden="true"
                fill="solid"
              />
            </button>
          </div>
          <div
            style={{ display: displayDown }}
            className="bg-translucide py-1 min-h-[245px] duration-300 text-white  border border-transparent hover:border-main-color rounded-full  transition-300"
          >
            <div
              onClick={handleClickUndisplay}
              className="cursor-pointer border-b-2 "
            >
              <ChevronUpIcon />
            </div>
            <div style={{ height: "fit-content;" }}>
              <div>
                {links.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group relative flex gap-x-6 rounded-lg hover:bg-gray-50"
                  >
                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        className="h-6 w-6 text-gray-600 text-blue-500 group-hover:text-indigo-600"
                        aria-hidden="true"
                        // fill="solid"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
      <header
        className={
          "fixed top-0 w-full  z-30 bg-transwhite transition-all " +
          (scrollActive ? " shadow-sm pt-0 bg-trans" : " pt-4")
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
            {/* <LinkScroll
              activeClass="active"
              href="about"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("about");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "about"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 a")
              }
            >
              About
            </LinkScroll> */}
            {/* <LinkScroll
              activeClass="active"
              href="feature"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("feature");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "feature"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 ")
              }
            >
              Feature
            </LinkScroll> */}
            {/* <LinkScroll
              activeClass="active"
              href="pricing"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("pricing");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "pricing"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 ")
              }
            >
              Pricing
            </LinkScroll> */}
            {/* <LinkScroll
              activeClass="active"
              to="testimoni"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("testimoni");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                (activeLink === "testimoni"
                  ? " text-orange-500 animation-active "
                  : " text-black-500 hover:text-orange-500 ")
              }
            >
              Testimonial
            </LinkScroll> */}
          </ul>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <ButtonOutline>S'enregistrer</ButtonOutline>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
