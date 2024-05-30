import React, { FC } from "react";
import css from "./InfoCard.module.css";

interface InfoCardprops {
  number?: number;
  text?: string;
}

export const InfoCard: FC<InfoCardprops> = ({ number, text }) => {
    const isNotEmpty = (number && text)
  return (
    <div className={`${css.card} ${isNotEmpty && css.notEmpty}`}>
      {isNotEmpty && (
        <>
          <p className={css.number}>{number}</p>
          <p className={css.text}>{text}</p>
        </>
      )}
    </div>
  );
};
