import express from "express";
import "reflect-metadata";
import "module-alias/register";
import { connect } from "./config/db/connect";
import routes from "./routes";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "@middlewares/error.middleware";

const PORT = process.env.PORT || 5001;
const app = express();
connect();

app.use(express.json(), routes);
app.use(errorMiddleware);
app.all("*", notFoundMiddleware);

app.listen(PORT, () => {
  console.info(`⚡️[server]: Server is running at http://0.0.0.0:${PORT}`);
});
