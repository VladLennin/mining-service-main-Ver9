import {Navigate, Route, Routes} from "react-router-dom";
import Main from "./Main/Main";
import BuyDiamondsPage from "./BuyDiamondsPage/BuyDiamondsPage";
import AdminLoginPage from "./AdminPage/AdminLoginPage";
import PrivateRoute from "../app/routes/PrivateRouter";
import AdminLayout from "./AdminPage/AdminLayout";
import AppStats from "./AdminPage/AppStats";
import UsersPage from "./AdminPage/UsersPage";
import AboutUser from "./AdminPage/AboutUser";
import ToolsPage from "./AdminPage/ToolsPage";

const Routing = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Main/>}/>
            {/* <Route path={"/withdraw/:userId/:token"} element={<WithdrawPage />} /> */}
            <Route path={"/diamonds/:amount/:userId/:token"} element={<BuyDiamondsPage/>}/>
            <Route path={'/admin/login'} element={<AdminLoginPage/>}/>
            <Route element={<PrivateRoute/>}>
                <Route element={<AdminLayout/>}>
                    <Route path={'/admin'} element={<Navigate to="/admin/appStats" />} />
                    <Route path={'/admin/appStats'} element={<AppStats/>}/>
                    <Route path={'/admin/tools'} element={<ToolsPage/>}/>
                    <Route path={'/admin/users'} element={<UsersPage/>}/>
                    <Route path={'/admin/users/:id'} element={<AboutUser/>}/>
                </Route>
            </Route>
        </Routes>
    );
};

export default Routing;
