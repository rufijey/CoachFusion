import React, {useRef, useState} from 'react';
import {Link} from "react-router-dom";
import cl from './Navbar.module.css'
import {AiOutlineUser} from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store.ts';
import { logout } from '../../../../modules/users/store/authThunks.ts';
import { clearUser } from '../../../../modules/users/store/userSlice.ts';

interface NavbarProps {
    classNames?: string;
}

const Navbar: React.FC<NavbarProps> = ({ classNames }) => {
    const [visible, setVisible] = useState(false);
    const dropdownRef = useRef(null);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    // const role = useSelector((state: RootState) => state.counter.role);
    const dispatch = useDispatch<AppDispatch>();

    const toggleDropdown = () => {
        setVisible(!visible);
    };

    const handleLogout = async () => {
        dispatch(logout());
        dispatch(clearUser());
    };


    return (
        <div className={[cl.navbar, classNames].join(' ')}>
            <div className={cl.main__links}>
                <Link to="/" className={cl.main__item}>CoachFusion</Link>
            </div>
            <div className={cl.navbar__links}>
                {isAuthenticated
                    ? <div className={cl.icon} onClick={toggleDropdown} ref={dropdownRef}>
                        <FaUserCircle className={cl.item} />
                        <div className={`${cl.dropdown} ${visible ? cl.visible : ''}`}>
                            <Link to="/profile" className={cl.dropdown__item}>Profile</Link>
                            <div onClick={handleLogout} className={cl.dropdown__item}>Logout</div>
                        </div>
                    </div>
                    : <div className={cl.icon} onClick={toggleDropdown} ref={dropdownRef}>
                        <AiOutlineUser className={cl.item} />
                        <div className={`${cl.dropdown} ${visible ? cl.visible : ''}`}>
                            <Link to="/registration" className={cl.dropdown__item}>Register</Link>
                            <Link to="/login" className={cl.dropdown__item}>Login</Link>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Navbar;
