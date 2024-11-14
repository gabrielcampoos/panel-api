import { randomUUID } from "crypto";
import { BeforeInsert, PrimaryColumn } from "typeorm";

export class BaseEntity {
  @PrimaryColumn()
  public id!: string;

  @BeforeInsert()
  public beforeInsert() {
    this.id = randomUUID();
  }
}
