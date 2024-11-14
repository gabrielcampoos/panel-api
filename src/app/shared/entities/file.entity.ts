import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeUpdate,
} from "typeorm";
import { randomUUID } from "crypto";
import { UserEntity } from "./user.entity";

@Entity({ name: "file" })
export class FileEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  filename!: string;

  @Column()
  filepath!: string;

  @Column({ type: "int" })
  size!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  uploadDate!: Date;

  @Column({ type: "boolean", default: true })
  available!: boolean;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;
  @BeforeInsert()
  beforeInsert() {
    this.id = randomUUID();
    this.uploadDate = new Date();
  }

  @BeforeUpdate()
  updateAvailability() {
    if (!this.user.isActive()) {
      this.available = false;
    }
  }

  isAvailable(): boolean {
    return this.available && this.user.isActive();
  }

  deactivate(): void {
    this.available = false;
  }

  activate(): void {
    this.available = true;
  }
}
