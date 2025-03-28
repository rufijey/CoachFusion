import React from 'react';
import cl from './ProfileLayout.module.css'
import Navbar from '../../components/Bars/Navbar/Navbar.tsx';
import { Outlet } from 'react-router-dom';
import ProfileNav from '../../../modules/users/components/ProfileNav/ProfileNav.tsx';

const ProfileLayout: React.FC = () => {
    return (
        <div className={cl.container}>
            <Navbar classNames={cl.nav}/>
            <ProfileNav />
            <Outlet />
        </div>
    );
};

export default ProfileLayout;