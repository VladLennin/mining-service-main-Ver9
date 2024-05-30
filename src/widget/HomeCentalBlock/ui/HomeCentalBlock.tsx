import { useTranslation } from "react-i18next";
import css from "./HomeCentalBlock.module.css";
import Button from "../../../shared/ui/Button/Button";
import mainPageImg from "./../../../assets/mainpage-img.png";
import AppearBlock from "../../../feature/AppearBlock/AppearBlock";

export const HomeCentalBlock = () => {
  const [t] = useTranslation(["translation"]);

  return (
    <div className={css.container}>
      <AppearBlock direction="left">
        <div className={css.subcontainer1}>
          <p className={css.title}>{t("mainpage.central-block.title")}</p>
          <p className={css.subtitle}>{t("mainpage.central-block.subtitle")}</p>
          <Button className={css.detailBtn1} onClick={()=>window.open('https://t.me/modok124', '_blank')}>
            <>{t("mainpage.central-block.detail-btn")}</>
          </Button>
        </div>
      </AppearBlock>

      <AppearBlock direction="right">
        <div  className={css.subcontainer2}>
          <img className={css.villainImage} src={mainPageImg} alt="" />
        </div>
      </AppearBlock>

      <div className={css.detailBtn2Container}>
        <Button className={css.detailBtn2}>
          <>{t("mainpage.central-block.detail-btn")}</>
        </Button>
      </div>
    </div>
  );
};
