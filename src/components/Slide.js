"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";

const SimpleSlider = () => {
  const [slideIndex, SetSlideIndex] = useState(0);
  

  function rightButton() {
    if (slideIndex == slideImg.length - 1) SetSlideIndex(0);
    else SetSlideIndex(slideIndex + 1);
  }

  function leftButton() {
    if (slideIndex == 0) SetSlideIndex(slideImg.length - 1);
    else SetSlideIndex(slideIndex - 1);
  }

  // Thumbnail image controls
  function currentSlide(n) {
    SetSlideIndex(n);
  }

  const slideImg = [
    { index: 0, src: "assets/slides/slide1.jpg", text: "Lorem ...." },
    { index: 1, src: "assets/slides/slide2.jpg", text: "Lorem ...." },
    { index: 2, src: "assets/slides/slide3.jpg", text: "Lorem ...." },
    { index: 3, src: "assets/slides/slide4.jpg", text: "Lorem ...." },
    { index: 4, src: "assets/slides/slide5.jpg", text: "Lorem ...." },
    { index: 5, src: "assets/slides/slide6.jpg", text: "Lorem ...." },
  ];

  return (
    <div>
      <div class="w-full relative m-auto">
        {/* <!-- Full-width images with number and caption text --> */}
        {slideImg.map((s) => (
          <div
            key={s.index}
            className={"" + (slideIndex === s.index ? "block" : "hidden")}
            style={{ animationName: "fade", animationDuration: "1.5s" }}
          >
            <div class="">
              <img
                src={s.src}
                style={{ width: "100%" }}
                className="saturate-150 grayscale-0"
              />
            </div>
            <div className="text-white-300 text-xl px-3 py-0">Caption Text</div>
          </div>
        ))}

        {/* <!-- Next and previous buttons --> */}
        <button
          className="cursor-pointer absolute bg-translucide hover:bg-blue-300 top-1/2 w-auto -mt-6 p-4 text-white-500 text-3xl left-0"
          style={{ userSelect: "none", transition: "0.6s" }}
          onClick={leftButton}
        >
          &#10094;
        </button>
        <button
          className="cursor-pointer absolute hover:bg-blue-300 top-1/2 w-auto -mt-6 p-4 text-white-500 text-3xl right-0"
          style={{ userSelect: "none", transition: "0.6s" }}
          onClick={rightButton}
        >
          &#10095;
        </button>
      </div>
      <br />

      {/* <!-- The dots/circles --> */}
      <div className="flex justify-center">
        {slideImg.map((s) => (
          <span
            key={s.index}
            onClick={() => currentSlide(s.index)}
            className={
              "cursor-pointer h-3 w-3 mx-1 " +
              (slideIndex === s.index ? "bg-blue-200" : "bg-translucide") +
              " rounded-xl inline-block hover:bg-blue-200"
            }
          ></span>
        ))}
      </div>
    </div>
  );
};

export default SimpleSlider;
