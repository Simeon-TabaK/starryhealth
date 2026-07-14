// src/components/Carousel.js
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function Carousel({ items = [] }) {
  const sliderRef = useRef(null);

  const next = () => sliderRef.current?.slickNext();
  const previous = () => sliderRef.current?.slickPrev();

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 4000,
    waitForAnimate: false,
    cssEase: "ease-in-out",
  };

  const defaultSlides = [
    { id: 0, imageUrl: "/assets/slides/slide1.jpg", title: "Bienvenue sur la plateforme" },
    { id: 1, imageUrl: "/assets/slides/slide2.jpg", title: "Découvrez nos produits" },
    { id: 2, imageUrl: "/assets/slides/slide3.jpg", title: "Personnalisez votre espace" },
  ];

  const slidesToRender = items.length > 0 ? items : defaultSlides;

  return (
    <div className="w-full relative m-auto">
      <Slider ref={sliderRef} arrows={false} {...settings}>
        {slidesToRender
          .filter((item) => item.visible !== false)
          .map((item) => (
            <div key={item.id} className="relative">
              {/* 🔹 Image */}
              <img
                src={item.imageUrl}
                alt={item.title || "carousel image"}
                className="saturate-150 grayscale-0 object-contain mx-auto"
                style={{ maxHeight: "500px", width: "100%" }}
              />

              {/* 🔹 Container titre avec dégradé */}
              {item.title && (
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent flex justify-center items-end">
                  <h3 className="text-3xl font-bold text-white px-6 py-4 text-center">
                    {item.title}
                  </h3>
                </div>
              )}
            </div>
          ))}
      </Slider>

      {/* Boutons navigation */}
      <button
        className="cursor-pointer absolute bg-gray-700/40 hover:bg-blue-500 top-1/2 -translate-y-1/2 p-4 text-white text-2xl left-0"
        onClick={previous}
      >
        &#10094;
      </button>
      <button
        className="cursor-pointer absolute bg-gray-700/40 hover:bg-blue-500 top-1/2 -translate-y-1/2 p-4 text-white text-2xl right-0"
        onClick={next}
      >
        &#10095;
      </button>
    </div>
  );
}
