import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn} from 'typeorm';
import {PortfolioItem} from "../portfolios/portfolio-item.entity";

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>PortfolioItem, item => item.images, {nullable:false})
    portfolioItem: PortfolioItem;

    @Column()
    path: string;

    @Column()
    url:string;

    @CreateDateColumn()
    createdAt: Date;
}