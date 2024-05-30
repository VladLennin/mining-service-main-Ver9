import css from "./HowToMineBlock.module.css";
import { InfoCard } from "./InfoCard/InfoCard";
import TitleWithBgLine from "../../../shared/ui/TitleWithBgLine/TitleWithBgLine";
import { useTranslation } from "react-i18next";
import AppearBlock from "../../../feature/AppearBlock/AppearBlock";

export const HowToMineBlock = () => {
  const [t] = useTranslation(["translation"]);

  return (
    <div className={css.container}>
      <AppearBlock direction="bottom">
        <div className={css.titleContainer}>
          <TitleWithBgLine value={t("mainpage.how-to-earn-block.title")} />
        </div>
      </AppearBlock>
      <div className={css.mainContainerDesktop}>
        <AppearBlock direction="bottom">
          <div className={css.infoCardsContainer}>
            <InfoCard />
            <InfoCard
              number={1}
              text={t("mainpage.how-to-earn-block.cards.card-1")}
            />
            <InfoCard
              number={2}
              text={t("mainpage.how-to-earn-block.cards.card-2")}
            />
            <InfoCard />
            <InfoCard />
          </div>
        </AppearBlock>

        <AppearBlock direction="bottom">
          <div className={css.infoCardsContainer}>
            <InfoCard />
            <InfoCard />
            <InfoCard
              number={3}
              text={t("mainpage.how-to-earn-block.cards.card-3")}
            />
            <InfoCard
              number={4}
              text={t("mainpage.how-to-earn-block.cards.card-4")}
            />
            <InfoCard />
          </div>
        </AppearBlock>
      </div>

      <div className={css.mainContainerMobile}>
        <div className={css.infoCardsContainer}>
          <AppearBlock direction="bottom">
            <InfoCard
              number={1}
              text={t("mainpage.how-to-earn-block.cards.card-1")}
            />
          </AppearBlock>

          <AppearBlock direction="bottom">
            <InfoCard
              number={2}
              text={t("mainpage.how-to-earn-block.cards.card-2")}
            />
          </AppearBlock>

          <AppearBlock direction="bottom">
            <InfoCard
              number={3}
              text={t("mainpage.how-to-earn-block.cards.card-3")}
            />
          </AppearBlock>

          <AppearBlock direction="bottom">
            <InfoCard
              number={4}
              text={t("mainpage.how-to-earn-block.cards.card-4")}
            />
          </AppearBlock>
        </div>
      </div>

      <div className={css.mainContainerTablet}>
        <AppearBlock direction="left">
          <div className={css.infoCardsTablet}>
            <InfoCard
              number={1}
              text={t("mainpage.how-to-earn-block.cards.card-1")}
            />
            <InfoCard
              number={2}
              text={t("mainpage.how-to-earn-block.cards.card-2")}
            />
          </div>
        </AppearBlock>

        <AppearBlock direction="right">
          <div className={css.infoCardsTablet}>
            <InfoCard
              number={3}
              text={t("mainpage.how-to-earn-block.cards.card-3")}
            />
            <InfoCard
              number={4}
              text={t("mainpage.how-to-earn-block.cards.card-4")}
            />
          </div>
        </AppearBlock>
      </div>
    </div>
  );
};
