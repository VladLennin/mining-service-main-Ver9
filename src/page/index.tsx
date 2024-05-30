import { Route, Routes } from "react-router-dom";
import Main from "./Main/Main";

const Routing = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Main />} />
    </Routes>
  );
};

export default Routing;
