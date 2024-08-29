import React from "react";
import Spinner from "../Spinner";
import css from "./SpinnerCentered.module.css";

const SpinnerCentered = () => {
  return (
    <div className={css.container}>
      <Spinner />
    </div>
  );
};

export default SpinnerCentered;
