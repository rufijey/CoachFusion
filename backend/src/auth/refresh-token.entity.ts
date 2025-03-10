import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'varchar', length: 255, nullable: false })
    token: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    fingerprint: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    expiresAt: Date;
}