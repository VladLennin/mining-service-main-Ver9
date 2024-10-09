import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {

    // @ts-ignore
    return 1===1 ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;

