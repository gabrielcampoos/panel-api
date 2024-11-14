import { Redis } from "ioredis";
import { appEnvs } from "../../app/envs/app.env";

export const redis = new Redis(appEnvs.redisUrl);
