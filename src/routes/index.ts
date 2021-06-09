import express from "express";
import projectsRoutes from "./projects.routes";
import usersRoutes from "./users.routes";

const router = express.Router();

router.use("/projects", projectsRoutes);
router.use("/users", usersRoutes);

export default router;
