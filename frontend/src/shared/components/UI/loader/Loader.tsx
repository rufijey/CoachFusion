import React from 'react';
import cl from './Loader.module.css'

interface Props {
    classNames?: string;
}

const Loader: React.FC<Props> = ({classNames}) => {
    return (
        <div className={cl.loader__container}>
            <div className={[cl.loader, classNames].join(' ')}>
            </div>
        </div>
    );
};

export default Loader;