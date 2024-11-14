import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeUpdate,
} from "typeorm";
import { randomUUID } from "crypto";

type Role = "admin" | "user";

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  cpf!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: ["admin", "user"], default: "user" })
  role!: Role;

  @Column({ default: true })
  active!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  accessExpiration!: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = randomUUID();
    this.accessExpiration = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  }

  @BeforeUpdate()
  updateAccessExpiration() {
    if (this.active) {
      this.accessExpiration = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    }
  }

  isActive(): boolean {
    return this.active && new Date() < this.accessExpiration;
  }

  deactivate(): void {
    this.active = false;
  }

  activate(): void {
    this.active = true;
  }
}
