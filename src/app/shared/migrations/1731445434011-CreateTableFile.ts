import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableFile1731445434011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "file",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "filename",
            type: "varchar",
          },
          {
            name: "filepath",
            type: "varchar",
          },
          {
            name: "size",
            type: "int",
          },
          {
            name: "uploadDate",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "available",
            type: "boolean",
            default: true,
          },
          {
            name: "userId",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["userId"],
            referencedTableName: "user",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("file", true, true, true);
  }
}
