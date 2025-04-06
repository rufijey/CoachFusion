import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate, ManyToOne, OneToMany, OneToOne, JoinColumn,
} from 'typeorm';
import * as bcrypt from "bcrypt";
import {RefreshToken} from "../auth/refresh-token.entity";
import {CoachProfile} from "../coach-profiles/coach-profile.entity";
import { ProfileImage } from '../images/profile-image.entity';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    COACH = 'coach',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => RefreshToken, token => token.user)
    refreshTokens: RefreshToken[];

    @OneToOne(() => CoachProfile, profile => profile.user, { nullable: true })
    coachProfile: CoachProfile;

    @OneToOne(() => ProfileImage, image => image.user, { nullable: true })
    profileImage: ProfileImage;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER, nullable: false })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
