import { Route, Routes } from "react-router-dom";
import Main from "./Main/Main";
import WithdrawPage from "./WithdrawPage/WithdrawPage";

const Routing = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Main />} />
      <Route path={"/withdraw/:userId"} element={<WithdrawPage />} />
    </Routes>
  );
};

export default Routing;
