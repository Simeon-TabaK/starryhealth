import React, { useRef } from "react";
import Slider from "react-slick";



export default function Carousel() {
  let sliderRef = useRef();
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };
  const settings = {
    dots: true,
    // fade:true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 4000,
    waitForAnimate: false,
    cssEase: "ease-in-out",
  };

  const slideImg = [
    { index: 0, src: "assets/slides/slide1.jpg", text: "Lorem ...." },
    { index: 1, src: "assets/slides/slide2.jpg", text: "Lorem ...." },
    { index: 2, src: "assets/slides/slide3.jpg", text: "Lorem ...." },
    { index: 3, src: "assets/slides/slide4.jpg", text: "Lorem ...." },
    { index: 4, src: "assets/slides/slide5.jpg", text: "Lorem ...." },
    { index: 5, src: "assets/slides/slide6.jpg", text: "Lorem ...." },
  ];

  return (
    <div className="w-full relative m-auto">
      <Slider
        ref={(slider) => {
          sliderRef = slider;
        }}
        arrows={false}
        {...settings}
      >
        {slideImg.map((s) => (
          <div
            key={s.index}
            // className={"" + (slideIndex === s.index ? "block" : "hidden")}
            // style={{ animationName: "fade", animationDuration: "1.5s" }}
          >
            <div class="">
              <img
                src={s.src}
                style={{ width: "100%" ,minHeight:"300px" }}
                // style={{ width: "100%", minHeight: "300px" }}
                className="saturate-150 grayscale-0"
              />
            </div>
          </div>
        ))}
      </Slider>
      <button
        className="cursor-pointer absolute bg-translucide hover:bg-blue-300 top-1/2 w-auto -mt-6 p-4 text-white-500 text-2xl left-0"
        style={{ userSelect: "none", transition: "0.6s" }}
        onClick={previous}
      >
        &#10094;
      </button>
      <button
        className="cursor-pointer absolute bg-translucide hover:bg-blue-300 top-1/2 w-auto -mt-6 p-4 text-white-500 text-2xl right-0"
        style={{ userSelect: "none", transition: "0.6s" }}
        onClick={next}
      >
        &#10095;
      </button>
    </div>
  );
}
