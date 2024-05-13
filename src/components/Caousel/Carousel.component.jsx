import Image from "next/image";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export default function CarouselComponent({ slides }) {
  let [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="mt-20 w-[60%] m-auto pt-11" style={{width:'100%', height:'100px'}}>
      <div className="relative" style={{position:"relative", overflow: "hidden" }}>
        <div
          className="flex translate ease-out duration-30"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {slides.map((s) => {
            return <img src={s} style={{ width: "100vw", height: "60vh" }} />;
          })}
          {/* <img src={slides[current]} style={{ width: "100vw", height: "70vh" }} /> */}
        </div>

        <div className="absolute top-0 h-full z-10 w-full flex justify-between items-center px-10 text-3xl">
          <button onClick={previousSlide}>
            <ArrowLeftCircleIcon
              className="h-6 w-6 text-gray-600 text-blue-500 group-hover:text-indigo-600"
              // fill="solid"
            />
          </button>
          <button onClick={nextSlide}>
            <ArrowRightCircleIcon
              className="h-6 w-6 text-gray-600 text-blue-500 group-hover:text-indigo-600"
              // fill="solid"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
