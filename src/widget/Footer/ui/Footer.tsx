import { useTranslation } from "react-i18next";
import css from "./Footer.module.css";
import twitterIcon from "./../../../assets/footer-links/twitter.png";
import facebookIcon from "./../../../assets/footer-links/facebook.png";
import telegramIcon from "./../../../assets/footer-links/telegram.png";
import { useState } from "react";

export const Footer = () => {
  const [t] = useTranslation(["translation"]);
  const [rules, setRules] = useState<boolean>(false);

  const openRules = () => setRules(true);
  const closeRules = () => setRules(false);
  const toggleRules = () => setRules(!rules);

  return (
    <div className={css.container}>
      <div className={css.iconsContainer}>
        {/* <div>
          <a href="">
            <img src={facebookIcon} alt="" />
          </a>
        </div> */}
        <div>
          <a href="https://x.com/MODOKCOIN?s=09">
            <img src={twitterIcon} alt="" />
          </a>
        </div>
        <div>
          <a href="https://t.me/modok124">
            <img src={telegramIcon} alt="" />
          </a>
        </div>
      </div>
    </div>
  );
};
