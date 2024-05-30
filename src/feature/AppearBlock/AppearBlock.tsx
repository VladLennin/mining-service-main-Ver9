import { motion } from "framer-motion";
import React, { FC, HTMLAttributes } from "react";
import css from "./AppearBlock.module.css";

interface AppearBlockProps extends HTMLAttributes<HTMLElement> {
  direction: string;
  children: React.ReactNode;
}

const AppearBlock: FC<AppearBlockProps> = ({
  direction,
  className,
  children,
}) => {
  switch (direction) {
    case "top":
      return (
        <motion.div
          className={`${css.container} ${className}`}
          initial={{ y: "-100%", position: "absolute" }}
          whileInView={{ y: 0, position: "relative" }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 0.9,
          }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      );

    case "bottom":
      return (
        <motion.div
          className={`${css.container} ${className}`}
          initial={{ y: "80%" }}
          whileInView={{ y: 0 }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 0.9,
          }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      );

    case "left":
      return (
        <motion.div
          className={`${css.container} ${className}`}
          initial={{ x: "-100%", position: "absolute" }}
          whileInView={{ x: 0, position: "relative" }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 0.9,
          }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      );

    case "right":
      return (
        <motion.div
          className={`${css.container} ${className}`}
          initial={{ x: "100%", position: "absolute" }}
          whileInView={{ x: 0, position: "relative" }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 0.9,
          }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      );
    default:
      return (
        <motion.div
          className={`${css.container} ${className}`}
          initial={{ x: "-100%", position: "absolute" }}
          whileInView={{ x: 0, position: "relative" }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 0.9,
          }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      );
  }
};

export default AppearBlock;
