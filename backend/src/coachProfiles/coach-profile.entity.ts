import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToMany, JoinTable, BeforeInsert, BeforeUpdate, OneToMany, UpdateDateColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import {Specialization} from "../specializations/specialization.entity";
import {PortfolioItem} from "../portfolios/portfolio-item.entity";

@Entity()
export class CoachProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.coachProfile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @ManyToMany(() => Specialization, specialization => specialization.coachProfiles)
    @JoinTable({ name: 'coach_specialization' })
    specializations: Specialization[];

    @OneToMany(() => PortfolioItem, item => item.coachProfile)
    portfolioItems: PortfolioItem[];

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'decimal', precision: 4, scale: 1, nullable: false, default: 0 })
    experience: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    roundExperience() {
        this.experience = parseFloat(this.experience.toFixed(1));
    }

}