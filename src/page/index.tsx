import { Route, Routes } from "react-router-dom";
import Main from "./Main/Main";
import WithdrawPage from "./WithdrawPage/WithdrawPage";
import BuyDiamondsPage from "./BuyDiamondsPage/BuyDiamondsPage";

const Routing = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Main />} />
      {/* <Route path={"/withdraw/:userId/:token"} element={<WithdrawPage />} /> */}
      <Route path={"/diamonds/:amount/:userId/:token"} element={<BuyDiamondsPage />} />
    </Routes>
  );
};

export default Routing;
