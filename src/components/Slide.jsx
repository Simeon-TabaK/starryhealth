import { Carousel } from "flowbite-react";
import Image from "next/image";

export default function Slide() {
  return (
    <div className="max-w-screen-xl mt-24 px-0 mx-0">
      <div className="h-5 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel slideInterval={500} slide={true}>
          {/* <Image
            src="/assets/logoStarry.png"
            width={80}
            height={60}
            alt="Free Plan"
          /> */}
          <img
            src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
            alt="..."
          />
          <img
            src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
            alt="..."
          />
          <img
            src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
            alt="..."
          />
          <img
            src="https://flowbite.com/docs/images/carousel/carousel-4.svg"
            alt="..."
          />
          <img
            src="https://flowbite.com/docs/images/carousel/carousel-5.svg"
            alt="..."
          />
        </Carousel>
      </div>
    </div>
  );
}
