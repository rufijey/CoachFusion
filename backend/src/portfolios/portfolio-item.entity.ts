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
import {Image} from "../images/image.entity";
import {text} from "express";
import {CoachProfile} from "../coach-profiles/coach-profile.entity";

@Entity()
export class PortfolioItem {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(()=>Image, image => image.portfolioItem)
    images: Image[];

    @ManyToOne(() => CoachProfile, profile => profile.portfolioItems)
    coachProfile: CoachProfile;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}