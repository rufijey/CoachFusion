import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany, UpdateDateColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import {PortfolioImage} from "../images/portfolio-image.entity";
import {text} from "express";
import {CoachProfile} from "../coach-profiles/coach-profile.entity";

@Entity()
export class PortfolioItem {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(()=>PortfolioImage, image => image.portfolioItem)
    images: PortfolioImage[];

    @ManyToOne(() => CoachProfile, profile => profile.portfolioItems, {nullable:false})
    coachProfile: CoachProfile;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}