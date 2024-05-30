import React, { FC } from "react";
import css from "./Container.module.css";

interface ContainerProps extends React.HTMLAttributes<HTMLElement>{
  children: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children, className }) => {
  return <div className={`${css.container} ${className}`}>{children}</div>;
};

export default Container;
