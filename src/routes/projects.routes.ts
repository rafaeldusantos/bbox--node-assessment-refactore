import express from "express";
import {
  listProjects,
  getProject,
  postProject,
  deleteProject,
} from "@controllers/projectsController";

const projectsRoutes = express.Router();

projectsRoutes.get("/", listProjects);
projectsRoutes.get("/:projectId", getProject);
projectsRoutes.post("/", postProject);
projectsRoutes.delete("/:projectId", deleteProject);

export default projectsRoutes;
