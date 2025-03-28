import React from 'react';
import cl from './UserLayout.module.css'
import Navbar from '../../components/Bars/Navbar/Navbar.tsx';
import { Outlet } from 'react-router-dom';

const UserLayout: React.FC = () => {
    return (
        <div className={cl.container}>
            <Navbar classNames={cl.nav}/>
            <Outlet />
        </div>
    );
};

export default UserLayout;