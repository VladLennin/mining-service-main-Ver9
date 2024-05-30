import { FC } from "react";
import css from "./EarnedCounter.module.css";
import { useTranslation } from "react-i18next";

interface EarnedCounterProps {
  count: number;
}

const EarnedCounter: FC<EarnedCounterProps> = ({ count }) => {
  const [t] = useTranslation(["translation"]);

  return (
    <div className={css.container}>
      <span className={css.balance}>
       {t("header.token-counter.balance")}
      </span>
      <span className={css.balance}>{count && count}</span>
    </div>
  );
};

export default EarnedCounter;
