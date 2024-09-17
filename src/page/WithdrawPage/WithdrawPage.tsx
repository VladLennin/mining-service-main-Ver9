import React, { useEffect, useState } from "react";
import css from "./WithdrawPage.module.css";
import { useParams } from "react-router-dom";
import { userStore } from "../../entity/user/store/UserStore";
import { User } from "../../entity/user/model/types";
import Spinner from "../../feature/Spinner/Spinner";

import {Web3} from "web3";
import { SecondAddress } from "../../AddressContract";
import { SecondContractABI } from "../../ABI";

declare var window: any
var web3: any;
var account: any;

const WithdrawPage = () => {
  const { userId,token } = useParams();
  token && localStorage.setItem("token", token);
  const [user, setUser] = useState<User>();
  const [amountWithdraw, setAmountWithdraw] = useState(0);
  
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
          <div className={css.username}>{user?.username}</div>
          <div className={css.balance}>
            Balance: {Math.round(user?.balance * 100) / 100}
          </div>
          <div className={css.withdrawContainer}>
            <input
              min={0}
              max={user.balance}
              defaultValue={amountWithdraw}
              onChange={(e) => {
                  setAmountWithdraw(e.target.valueAsNumber);
              }}
              className={css.withdrawAmount}
              type="number"
            />
            <button
              disabled={amountWithdraw > user.balance}
              onClick={async() => {
                let contract : any;
                try{
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
                  contract.methods.BuyTokens(amountWithdraw).send({from: account}).then(()=>
                    userStore
                    .withdrawBalance(user?.id, Math.abs(amountWithdraw))
                    .then((res) => {
                      setUser(res);
                    })
                    .catch((e) => {
                      console.log(e);
                    })
                    )
                } catch (e){
                  console.log(e);
                }
                }  
              }
              className={css.withdrawBtn}
            >
              Withdraw
            </button>
          </div>
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

export default WithdrawPage;
