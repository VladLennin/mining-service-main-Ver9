import {Route, Routes} from "react-router-dom";
import Main from "./Main/Main";
import WithdrawPage from "./WithdrawPage/WithdrawPage";
import BuyDiamondsPage from "./BuyDiamondsPage/BuyDiamondsPage";
import AdminLoginPage from "./AdminPage/AdminLoginPage";
import AdminPage from "./AdminPage/AdminPage";
import PrivateRoute from "../app/routes/PrivateRouter";

const Routing = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Main/>}/>
            {/* <Route path={"/withdraw/:userId/:token"} element={<WithdrawPage />} /> */}
            <Route path={"/diamonds/:amount/:userId/:token"} element={<BuyDiamondsPage/>}/>
            <Route path={'/admin/login'} element={<AdminLoginPage/>}/>
            <Route element={<PrivateRoute/>}>
                <Route path={'/admin'} element={<AdminPage/>}/>
            </Route>
        </Routes>
    );
};

export default Routing;
