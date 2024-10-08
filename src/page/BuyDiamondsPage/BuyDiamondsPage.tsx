import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import css from "./BuyDiamonsPage.module.css";
import { userStore } from "../../entity/user/store/UserStore";
import { User } from "../../entity/user/model/types";
import Spinner from "../../feature/Spinner/Spinner";
import diamond from "../../assets/diamond.png";

import { Web3 } from "web3";
import { SecondAddress } from "../../AddressContract";
import { SecondContractABI } from "../../ABI";

declare var window: any;
var web3: any;
var account: any;

const BuyDiamondsPage = () => {
  const { userId, token, amount } = useParams();
  const [user, setUser] = useState<User>();

  const amounts: number[] = [100, 500, 1000, 1500, 5000];

  token && localStorage.setItem("token", token);

  const handleBuy = async () => {
    let contract: any;
    try {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          web3 = new Web3(window.ethereum);
          account = accounts[0];
        } catch (error) {
          console.log("Error connecting...");
        }
      } else {
        console.log("Download Metamask");
      }

      contract = new web3.eth.Contract(SecondContractABI, SecondAddress);
      userId &&
        amount &&
          contract.methods.BuyTokens(amount)
            .send({ from: account })
            .then(() => {
              userStore
                .refillDiamonds(Number(userId), Number(amount))
                .then((res) => {
                  alert("Your balance was refilled!");
                  setUser(res);
                })
                .catch((e) => {
                  console.log(e);
                });
            });
    } catch (e) {
      console.log(e);
    }
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

  if (amount) {
    if (!amounts.includes(Number(amount))) {
      return (
        <div className={css.container}>
          <div className={css.userCard}>
            Something happened with your amount of super coins
          </div>
        </div>
      );
    }
  }

  if (!token) {
    return (
      <div className={css.container}>
        <div className={css.userCard}>Your session went wrong</div>
      </div>
    );
  }

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
