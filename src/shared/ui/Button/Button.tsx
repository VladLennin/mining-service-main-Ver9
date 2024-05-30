import React, { ButtonHTMLAttributes, FC } from "react";
import css from "./Button.module.css";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  transparent?: boolean;
}

const Button: FC<ButtonProps> = ({ children, transparent, className, onClick }) => {
  return (
    <button onClick={onClick} className={`${css.btn} ${transparent && css.transparent} ${className && className}`}>
      {children}
    </button>
  );
};

export default Button;
