import React, { FC, useLayoutEffect, useState } from "react";
import css from "./CarouselItemCard.module.css";

interface ItemCardProps {
  img: string;
}

export const CarouselItemCard: FC<ItemCardProps> = ({ img }) => {
  return (
    <>
      <div className={css.cover}>
        <div className={css.brightCover} />
        <div className={css.card}>
          <img src={img} alt="" />
        </div>
        <div className={css.description}>
          <p>Title</p>
          <p>Cost</p>
        </div>
      </div>
    </>
  );
};
