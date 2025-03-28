import React from 'react';
import cl from './CoachPortfolio.module.css'

interface PortfolioItem {
    id: number;
    description: string;
    images: { url: string }[];
}

interface CoachPortfolioProps {
    portfolioItems: PortfolioItem[];
}

const CoachPortfolio: React.FC<CoachPortfolioProps> = ({ portfolioItems }) => {

    return (
        <div className={cl.portfolio_container}>
            {portfolioItems.length > 0 && (
                portfolioItems.map((item) => (
                    <div key={item.id} className={cl.portfolio_item}>
                        <div className={cl.images_container}>
                            {item.images.map((img, index) => (
                                <img key={index} src={img.url} alt={`Portfolio ${index}`} className={cl.portfolio_image}/>
                            ))}
                        </div>
                        <div className={cl.portfolio_description}>{item.description}</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CoachPortfolio;
