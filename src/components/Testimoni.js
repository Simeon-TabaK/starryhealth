"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Stars from "../../public/assets/Icon/stars.svg";
import ArrowBack from "../../public/assets/Icon/eva_arrow-back-fill.svg";
import ArrowNext from "../../public/assets/Icon/eva_arrow-next-fill.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Testimoni() {
  // 🔹 Valeurs par défaut si la base est vide
  const defaultTestimoni = [
    {
      id: 0,
      profile: {
        firstName: "Clovis",
        lastName: "CHAP",
        city: "Goma",
        country: "RD Congo",
        image: "/assets/people-3.png",
      },
      rating: 4.0,
      content:
        "Pleurage... Je suis très heureux de travailler avec Starry Digital, ils ont dépassé mes attentes.",
    },
    {
      id: 1,
      profile: {
        firstName: "Gaelle",
        city: "Goma",
        country: "RD Congo",
        image: "/assets/people-2.png",
      },
      rating: 4.2,
      content: "Résultats concrets ! J’ai vu une augmentation significative de notre visibilité en ligne.",
    },
  ];

  const [listTestimoni, setListTestimoni] = useState(defaultTestimoni);

  // 🔹 Récupération depuis l’API
  useEffect(() => {
    fetch("/api/testimonies")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setListTestimoni(data);
        }
      })
      .catch(() => {
        // en cas d’erreur, on garde les valeurs par défaut
        setListTestimoni(defaultTestimoni);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 770, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const [sliderRef, setSliderRef] = useState(null);

  return (
    <>
      <Slider {...settings} arrows={false} ref={setSliderRef}>
        {listTestimoni.map((t, index) => (
          <div className="px-3 flex items-stretch" key={t.id || index}>
            <div className="border-2 border-gray-500 hover:border-orange-500 transition-all rounded-lg p-8 flex flex-col">
              <div className="flex flex-col xl:flex-row w-full items-stretch xl:items-center">
                <div className="flex order-2 xl:order-1">
                  <Image
                    src={t.profile?.image || "/assets/default-user.png"}
                    height={55}
                    width={55}
                    className="rounded-full"
                    alt={t.profile?.firstName || "User"}
                  />
                  <div className="flex flex-col ml-5 text-left">
                    <p className="text-lg text-black-600 capitalize">
                      {t.profile?.firstName} {t.profile?.lastName}
                    </p>
                    <p className="text-sm text-black-500 capitalize">
                      {t.profile?.city}, {t.profile?.country}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center ml-auto order-1 xl:order-2">
                  <p className="text-sm">{t.rating}</p>
                  <span className="flex ml-4">
                    <Stars className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <p className="mt-5 text-left">“{t.content}”.</p>
            </div>
          </div>
        ))}
      </Slider>

      {/* Navigation */}
      <div className="flex w-full items-center justify-end">
        <div className="flex flex-none justify-between w-auto mt-14">
          <div
            className="mx-4 flex items-center justify-center h-14 w-14 rounded-full bg-white border-orange-500 border hover:bg-orange-500 transition-all text-orange-500 cursor-pointer"
            onClick={() => sliderRef?.slickPrev()}
          >
            <ArrowBack className="h-6 w-6 " />
          </div>
          <div
            className="flex items-center justify-center h-14 w-14 rounded-full bg-white border-orange-500 border hover:bg-orange-500 transition-all text-orange-500 cursor-pointer"
            onClick={() => sliderRef?.slickNext()}
          >
            <ArrowNext className="h-6 w-6" />
          </div>
        </div>
      </div>
    </>
  );
}
