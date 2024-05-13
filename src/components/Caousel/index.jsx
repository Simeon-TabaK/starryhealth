import CarouselComponent from "./Carousel.component";

export default function Carousel() {
  let slides = [
    // "/assets/logoStarry.png",
    "https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_0rWvumyST3jwTlWdO88YL4CT1OuovQcHLwhymlmfurLCqekh5l7XHZV-A8O_aUBeLzE&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeatZ3nkxayRGgpV5CTjM5SIkkuUdInheBkc3n30Eo4Q&s",
  ];

  return (
    <div className="mt-20 w-[60%] m-auto pt-11">
      <CarouselComponent slides={slides} />
    </div>
  );
}
