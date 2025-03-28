import React from 'react';
import cl from './ProfileNav.module.css';
import {useNavigate, useLocation} from "react-router-dom";

const ProductNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={cl.product__nav}>
            <div
                onClick={() => navigate(`/profile`)}
                className={[cl.link, isActive(`/profile`) ? cl.underline : ''].join(' ')}
            >
                Profile
            </div>
            <div
                onClick={() => navigate(`/coach-profile`)}
                className={[cl.link, isActive(`/coach-profile`) ? cl.underline : ''].join(' ')}
            >
                Coach Profile
            </div>
        </div>
    );
};

export default ProductNav;
