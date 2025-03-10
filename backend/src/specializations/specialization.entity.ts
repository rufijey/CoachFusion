import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import {CoachProfile} from "../coachProfiles/coach-profile.entity";

@Entity()
export class Specialization {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => CoachProfile, profile => profile.specializations)
    coachProfiles: CoachProfile[];

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}