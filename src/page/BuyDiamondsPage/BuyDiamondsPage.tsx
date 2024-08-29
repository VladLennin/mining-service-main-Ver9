import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import css from "./BuyDiamonsPage.module.css";
import { userStore } from "../../entity/user/store/UserStore";
import { User } from "../../entity/user/model/types";
import Spinner from "../../feature/Spinner/Spinner";
import diamond from "../../assets/diamond.webp";

const BuyDiamondsPage = () => {
  const { userId, amount } = useParams();

  const [user, setUser] = useState<User>();

  const handleBuy = () => {
    userId &&
      amount &&
      userStore
        .refillDiamonds(Number(userId), Number(amount))
        .then((res) => {
          alert("Your balance was refilled!");
          setUser(res);
        })
        .catch((e) => {
          console.log(e);
        });
  };

  useEffect(() => {
    userId &&
      userStore
        .getUserById(Number(userId))
        .then((res) => {
          setUser(res);
        })
        .catch((e) => {
          console.log(e);
        });
  }, []);

  if (user) {
    return (
      <div className={css.container}>
        <div className={css.userCard}>
          <div className={css.balance}>
            You have <span className={css.amount}>{user.diamondsBalance}</span>
            <img className={css.diamond} src={diamond} alt="" />
            on your balance
          </div>
          <div className={css.balance}>
            <span>
              You have chosen to buy
              <span className={css.amount}> {amount}</span>
            </span>
            <img className={css.diamond} src={diamond} alt="" />
          </div>
          <button onClick={handleBuy} className={css.btnBuy}>
            Buy
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={css.container}>
        <Spinner />
      </div>
    );
  }
};

export default BuyDiamondsPage;
