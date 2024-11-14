import { RedisConnection } from "./database/ioredis.connection";
import { DatabaseConnection } from "./database/typeorm.connection";
import { runServer } from "./server/express.server";

Promise.all([DatabaseConnection.connect(), RedisConnection.connect()])
  .then(runServer)
  .catch((err) => {
    console.log(err.toString());
  });
