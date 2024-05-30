import React, { FC, useEffect } from "react";
import "./InfinityCarousel.css";
import ItemCard from "../CarouselItemCard";

interface CarouselProps {
  data: any[];
  direction:string;
  speed:string;
}

const InfinityCarousel:FC<CarouselProps> = ({data, direction="right",speed="slow"}) => {
  useEffect(() => {
    const scrollers = document.querySelectorAll(".scroller");

    // If a user hasn't opted in for recuded motion, then we add the animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        // add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute("data-animated", "true");

        // Make an array from the elements within `.scroller-inner`
        const scrollerInner = scroller.querySelector(".scroller__inner");
        if (scrollerInner) {
          const scrollerContent = Array.from(scrollerInner.children);

          // For each item in the array, clone it
          // add aria-hidden to it
          // add it into the `.scroller-inner`
          scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            // @ts-ignore
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
          });
        }
      });
    }
  }, []);

  return (
    <div>
      <div className="scroller" data-direction={direction} data-speed={speed}>
        <div className="scroller__inner">
          {data.map((item) => (
           <ItemCard img={item}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfinityCarousel;
