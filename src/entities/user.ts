import * as crypto from "node:crypto";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: "users"
})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    uuid!: string;

    @Column({ unique: true, nullable: true })
    telegramId?: number;

    @Column({ nullable: false })
    firstName!: string;

    @Column({ nullable: true })
    lastName?: string;

    /**
     * The username of the user.  
     * This is unique and can be used to identify the user.  
     * If the user has no username, the Telegram ID is used instead.
     */
    @Column({ unique: true })
    username!: string;

    @Column({ nullable: true })
    lastInteraction!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @BeforeInsert()
    generateUuid() {
        this.uuid = crypto.randomUUID();
    }
}