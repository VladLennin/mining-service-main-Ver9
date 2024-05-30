import { useTranslation } from "react-i18next";
import css from "./FooterOld.module.css";
import Title from "../../../shared/ui/Title/Title";

export const FooterOld = () => {
  const [t] = useTranslation(["translation"]);
  return (
    <div>
      <div className={css.container}>
        <div className={css.logoCol}>
          <Title />
          <div className={css.subtitle}>{t("footer.subtitle")}</div>
        </div>

        <div className={css.col}>
          <p>{t("footer.about.title")}</p>
          <div>{t("footer.about.link-1")}</div>
          <div>{t("footer.about.link-2")}</div>
        </div>

        <div className={css.col}>
          <p>{t("footer.contacts.title")}</p>
          <div>{t("footer.contacts.link-1")}</div>
          <div>{t("footer.contacts.link-2")}</div>
        </div>

        <div className={css.col}>
          <p>{t("footer.support.title")}</p>
          <div>{t("footer.support.link-1")}</div>
        </div>

        <div className={css.followCol}>
          <p>{t("footer.subscribe.title")}</p>
          <div className={css.linksContainer}>
            <a href="" className={css.discordLink}></a>
            <a href="" className={css.twitterLink}></a>
            <a href="" className={css.telegramLink}></a>
          </div>
        </div>
      </div>
      <div className={css.rightsContainer}><p>{t("footer.rights")}</p></div>
    </div>
  );
};
