import React from 'react';
import {Navigate, Outlet} from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';

const UnRegisteredRoute: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if(isAuthenticated){
        return <Navigate to={'/profile'}/>
    }
    return <Outlet/>;
};

export default UnRegisteredRoute;