import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn} from 'typeorm';
import {PortfolioItem} from "../portfolios/portfolio-item.entity";
import { User } from '../users/user.entity';

@Entity()
export class ProfileImage {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(()=>User, user => user.profileImage, {nullable:false})
    user: User;

    @Column()
    path: string;

    @Column()
    url:string;

    @CreateDateColumn()
    createdAt: Date;
}