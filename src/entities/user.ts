import * as crypto from "node:crypto";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: "users"
})
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    uuid!: string;

    @Column({ unique: true, nullable: true })
    telegramId?: number;

    @Column({ unique: true })
    username!: string;

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