import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";
import Project from "@entity/Project";
import User from "@entity/User";
import { ProjectRequestBody } from "@interfaces/ProjectRequestBody";
import HttpException from "@utils/HttpException";
import validatePayload from "@utils/ValidatePayload";

export const schemaProjectRequest = Joi.object({
  userId: Joi.string().uuid().required(),
  description: Joi.string().required(),
});

export const listProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.query;
    const projects = userId
      ? await Project.find({
          where: {
            owner: userId,
          },
        })
      : await Project.find();

    res.status(httpStatus.OK).json(projects);
  } catch (error) {
    return next(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectId } = req.params;
  try {
    const project: Project = await Project.findOne({
      where: { uuid: projectId },
    });

    if (!project) {
      throw new HttpException(httpStatus.NOT_FOUND, "User not found!");
    }

    res.status(httpStatus.OK).json(project);
  } catch (error) {
    return next(error);
  }
};

export const postProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const bodyReq: ProjectRequestBody = body;

  try {
    const errorValidate = validatePayload(bodyReq, schemaProjectRequest);
    if (errorValidate) {
      throw new HttpException(
        httpStatus.BAD_REQUEST,
        errorValidate.details[0].message
      );
    }

    const user: User = await User.findOne({ uuid: bodyReq.userId });

    if (!user) {
      throw new HttpException(httpStatus.NOT_FOUND, "User not found!");
    }

    const project: Project = Project.create({
      uuid: uuidv4(),
      description: bodyReq.description,
      owner: user,
      creationDate: new Date(),
    });
    await project.save();
    delete project.owner.password;

    res.status(httpStatus.CREATED).json(project);
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectId } = req.params;
  try {
    const project: Project = await Project.findOne({
      where: { uuid: projectId },
    });
    if (!project) {
      throw new HttpException(httpStatus.NOT_FOUND, "User not found!");
    }

    Project.delete(project);
    res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};
