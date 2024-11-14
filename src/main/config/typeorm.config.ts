import "dotenv/config";
import { DataSource } from "typeorm";
import { appEnvs } from "../../app/envs";
import { postgresEnvs } from "../../app/envs/postgres.env";

const isProduction = appEnvs.ambiente === "production";
const isTest = appEnvs.ambiente?.toLocaleLowerCase() === "test";
const rootDir = isProduction ? "dist" : "src";

export default new DataSource({
  type: "postgres",
  url: isTest ? postgresEnvs.urlTest : postgresEnvs.url,
  entities: [rootDir + "/app/shared/entities/**/*"],
  migrations: [rootDir + "/app/shared/migrations/**/*"],
  synchronize: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
