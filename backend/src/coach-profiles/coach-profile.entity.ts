import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { User } from '../users/user.entity';
import { Specialization } from "../specializations/specialization.entity";
import { PortfolioItem } from "../portfolios/portfolio-item.entity";

export enum WorkMode {
    ONLINE = 'online',
    OFFLINE = 'offline',
    BOTH = 'both',
}

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

    @Column({ type: 'varchar', length: 255, nullable: false })
    city: string;

    @Column({
        type: 'enum',
        enum: WorkMode,
        default: WorkMode.BOTH
    })
    workMode: WorkMode;

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
