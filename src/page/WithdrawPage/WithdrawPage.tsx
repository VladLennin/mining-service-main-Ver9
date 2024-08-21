import React, { useEffect, useState } from "react";
import css from "./WithdrawPage.module.css";
import { useParams } from "react-router-dom";
import { userStore } from "../../entity/user/store/UserStore";
import { User } from "../../entity/user/model/types";

const WithdrawPage = () => {
  const { userId } = useParams();
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
  if (user) {
    return (
      <div className={css.container}>
        <div className={css.userCard}>
          <div className={css.username}>{user?.username}</div>
          <div className={css.balance}>Balance: {user?.balance}</div>
          <div className={css.withdrawContainer}>
            <input
              defaultValue={amountWithdraw}
              onChange={(e) => {
                setAmountWithdraw(e.target.valueAsNumber);
              }}
              className={css.withdrawAmount}
              type="number"
            />
            <button
              onClick={() =>
                userStore
                  .withdrawBalance(user?.id, amountWithdraw)
                  .then((res) => {
                    setUser(res);
                  })
                  .catch((e) => {
                    console.log(e);
                  })
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
    return <div>Error happened</div>;
  }
};

export default WithdrawPage;