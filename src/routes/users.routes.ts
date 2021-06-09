import express from "express";
import {
  listUsers,
  getUser,
  postUser,
  deleteUser,
} from "@controllers/usersControlles";

const userssRoutes = express.Router();

userssRoutes.get("/", listUsers);
userssRoutes.get("/:id", getUser);
userssRoutes.post("/", postUser);
userssRoutes.delete("/:id", deleteUser);

export default userssRoutes;
