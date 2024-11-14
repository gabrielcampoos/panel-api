import "dotenv/config";

export const postgresEnvs = {
  url: process.env.DB_URL,
  urlTest: process.env.DB_TEST_URL,
};
