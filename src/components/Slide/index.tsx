"use client";

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, UseDotButton } from "./EmblaCarouselDotButton";
import {
  PrevButton,
  NextButton,
  UsePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import UseEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: [];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = UseEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    UseDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = UsePrevNextButtons(emblaApi);

  return (
    <section className="embla mx-2">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide w-full" key={index}>
              <img src={[index]} style={{ width: "100%", height: "65vh" }} />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        {/* <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div> */}

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
              children=<button>
                <span className="text-5xl text-red-400">.</span>
              </button>
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
