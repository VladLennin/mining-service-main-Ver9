import React from 'react';
import Sidebar from './Sidebar';
import {Outlet} from "react-router-dom";
import './AdminPage.css';


const AdminLayout = () => {
    return (
        <div className={'w-screen h-screen flex flex-col lg:flex-row'}>
            <Sidebar/>
            <div className={'bg-white lg:w-5/6 h-full w-full overflow-y-auto'}>
                <div className={'p-4'}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
