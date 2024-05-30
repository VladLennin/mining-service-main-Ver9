import React, { FC } from "react";
import css from "./TitleWithBgLine.module.css";
interface TitleWithBgLineProps {
  value: string;
}

const TitleWithBgLine: FC<TitleWithBgLineProps> = ({ value }) => {
  return <p className={css.title}>{value}</p>;
};

export default TitleWithBgLine;
