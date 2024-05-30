import { FC, useEffect, useState } from "react";
import { Item } from "../../entity/item/model/types";
import Container from "../../shared/ui/Container/Container";
import css from "./ItemCard.module.css";
import "./ItemCard.module.css";
import CardControls from "./ui/CardControls/CardControls";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useTranslation } from "react-i18next";
import arrow from "../../assets/arrow.svg";
import Button from "../../shared/ui/Button/Button";
import {Cards} from "../../widget/CollectionsBlock/ui/CollectionsBlock";
import {resolveObjectURL} from "node:buffer";

interface ItemCardProps {
  item: Cards;
  changeStateEarning: ()=>void;
}

const ItemCard: FC<ItemCardProps> = ({ item , changeStateEarning}) => {
  const [t] = useTranslation(["translation"]);
  const [_item, setItem] = useState(item);
  const [rerender, setRerender] = useState(false);

  const forceRerender = () => setRerender(!rerender);
  useEffect(() => {
    const data = localStorage.getItem(`${item.id}`);
    if (data) {
      setItem(JSON.parse(data));
    } else {
      localStorage.setItem(`${item.id}`, JSON.stringify(item));
    }
    generateButtons();
  }, []);


  const generateButtons = () =>{
      const contBought = Number(item.earned?.split(' ')[0]);
      if(item.wasBought && contBought === 0) {
          return <p>{t("general.start-earning")}</p>;
      }
      if (item.wasBought && contBought > 0) {
          return  !item.startedEarning ? <p>{t("general.get-money")}</p> : <p>{t("general.start-earning")}</p>;
      }
  }

    return (
        <Container className={css.card}>
      <p className={css.title}>{item.title}</p>

      <p className={css.charakteristic}>
        {`${t("general.card-earning.part-1")} ${item.earning} ${t(
          "general.card-earning.part-2"
        )}`}
      </p>
      <Carousel
        showStatus={false}
        showThumbs={false}
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={false}
        interval={5000}
        renderArrowNext={(onClickHandler, hasNext, label) => (
          <button
            className={css.arrowR}
            type="button"
            onClick={onClickHandler}
            title={label}
          >
            <img src={arrow} alt="" />
          </button>
        )}
        renderArrowPrev={(onClickHandler, hasNext, label) => (
          <button
            className={css.arrowL}
            type="button"
            onClick={onClickHandler}
            title={label}
          >
            <img src={arrow} alt="" />
          </button>
        )}
      >
        {item.images.map((img) => (
          <div className={css.imgContainer}>
            <div className={css.cover} />
            <img src={require(`./../../assets/NFTs/${img}`)} />
          </div>
        ))}
      </Carousel>
      {item.wasBought && (
        <div className={css.haveControls}>
          <div className={css.earnedIndicatorContainer}>
            {t("general.card-earning.earned")}: {item.earned}
          </div>
          <div className={css.withdrawContainer}>
            <Button
              onClick={()=>{
                  changeStateEarning();
              }}
              className={css.withdrawBtn}
            >
              {generateButtons()}
              {/*{item.wasBought !== true  ? (*/}
              {/*  <p>{t("general.get-money")}</p>*/}
              {/*) : (*/}
              {/*  <p>{t("general.start-earning")}</p>*/}
              {/*)}*/}
            </Button>
          </div>
        </div>
      )}
      <CardControls id={item.id} />
    </Container>
  );
};

export default ItemCard;
