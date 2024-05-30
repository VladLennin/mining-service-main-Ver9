import { useTranslation } from "react-i18next";
import Container from "../../../shared/ui/Container/Container";
import TitleWithBgLine from "../../../shared/ui/TitleWithBgLine/TitleWithBgLine";
import css from "./AboutUsBlock.module.css";
import people from "./../../../assets/features/people.png";
import coins from "./../../../assets/features/coins.png";
import cards from "./../../../assets/features/cards.png";
import AppearBlock from "../../../feature/AppearBlock/AppearBlock";

export const FeaturesBlock = () => {
  const [t] = useTranslation(["translation"]);
  return (
    <div className={css.container}>
      <div className={css.titleContainer}>
        <TitleWithBgLine value={t("mainpage.about-us-block.title")} />
      </div>

      <div className={css.featuresContainer}>
        <AppearBlock direction="left">
          <div className={css.justBlockLeft} />
        </AppearBlock>
        
        <AppearBlock direction="bottom">
          <Container className={css.feature}>
            <p>{t("mainpage.about-us-block.feature-1.title")}</p>
            <div className={css.imgContainer}>
              <img src={people} alt="" />
            </div>
          </Container>
        </AppearBlock>

        <AppearBlock direction="bottom">
          <Container className={css.feature}>
            <p>{t("mainpage.about-us-block.feature-2.title")}</p>
            <div className={css.imgContainer}>
              <img src={cards} alt="" />
            </div>
          </Container>
        </AppearBlock>

        <AppearBlock direction="bottom">
          <Container className={css.feature}>
            <p>{t("mainpage.about-us-block.feature-3.title")}</p>
            <div className={css.imgContainer}>
              <img src={coins} alt="" />
            </div>
          </Container>
        </AppearBlock>

        <AppearBlock direction="right">
          <div className={css.justBlockRight} />
        </AppearBlock>
      </div>
      <AppearBlock direction="bottom">
        <div className={css.description}>
          <p className={css.content}>
            <span>{t("general.title-logo")}</span>
            {t("mainpage.about-us-block.description.title")}
          </p>
          <div className={css.subcontent}>
            {t("mainpage.about-us-block.description.content")}
          </div>
        </div>
      </AppearBlock>
    </div>
  );
};
