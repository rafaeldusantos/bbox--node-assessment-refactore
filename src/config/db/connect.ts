import { createConnection } from "typeorm";

export const connect = async () => {
  createConnection()
    .then((_) => console.log("☁ [database]: Database connection established"))
    .catch((error) =>
      console.error(`⚠ [database]: Couldn't connect to the database: ${error}`)
    );
};
