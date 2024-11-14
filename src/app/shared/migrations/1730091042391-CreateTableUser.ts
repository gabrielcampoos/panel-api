import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1638572945046 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "cpf",
            type: "varchar",
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "role",
            type: "enum",
            enum: ["admin", "user"],
            default: "'user'",
          },
          {
            name: "active",
            type: "boolean",
            default: true,
          },
          {
            name: "accessExpiration",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user", true, true, true);
  }
}
