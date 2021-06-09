import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import User, { UserEvent, UserRole } from "@entity/User";
import { UserRequestBody } from "@interfaces/UserRequestBody";
import HttpException from "@utils/HttpException";
import validatePayload from "@utils/ValidatePayload";

export const schemaUserRequest = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .regex(/^[0-9]{10,11}$/)
    .error(() => ({
      name: "phoneNumber",
      message: "invalid format",
    }))
    .required(),
  password: Joi.string().required(),
});

export const listUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(httpStatus.OK).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = await User.findOne({
      uuid: req.params.id,
    });

    if (!user) {
      throw new HttpException(httpStatus.NOT_FOUND, "User not found!");
    }

    res.status(httpStatus.OK).json(user);
  } catch (error) {
    return next(error);
  }
};

export const postUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const bodyReq: UserRequestBody = body;
  try {
    const errorValidate = validatePayload(bodyReq, schemaUserRequest);
    if (errorValidate) {
      throw new HttpException(
        httpStatus.BAD_REQUEST,
        errorValidate.details[0].message
      );
    }

    const user: User = User.create({
      uuid: uuidv4(),
      firstName: bodyReq.firstName,
      lastName: bodyReq.lastName,
      email: bodyReq.email,
      phoneNumber: bodyReq.phoneNumber,
      password: bodyReq.password,
      role: UserRole.CLIENT,
      creationDate: new Date(),
      currentEvent: UserEvent.CREATION,
    });
    await user.save();

    delete user.password;
    res.status(httpStatus.CREATED).json(user);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params.id);
  try {
    const user: User = await User.findOne({
      uuid: req.params.id,
    });

    console.log(user);

    if (!user) {
      throw new HttpException(httpStatus.NOT_FOUND, "User not found!");
    }

    User.delete(user);
    res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};
