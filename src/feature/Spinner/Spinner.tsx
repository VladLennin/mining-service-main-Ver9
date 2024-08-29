import React from "react";
import { useSpring, animated } from "@react-spring/web";
import logo from "../../assets/logo.png";
const Spinner: React.FC = () => {
  const { transform, scale } = useSpring({
    from: { transform: "rotate(0deg)", scale: 1 },
    to: async (next) => {
      while (1) {
        await next({ scale: 1, config: { duration: 400 } });
        await next({ scale: 1.2, config: { duration: 400 } });
        await next({ scale: 1, config: { duration: 400 } });
      }
    },
    reset: true,
    loop: true,
  });

  return (
    <animated.img
      src={logo}
      style={{
        transform: transform,
        scale: scale.to((s) => s.toFixed(2)), // Ensure scale is correctly formatted
        width: "100px",
        height: "100px",
        backgroundSize: "cover",
      }}
    />
  );
};

export default Spinner;
