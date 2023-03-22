import { Request, Response } from "express";
import { validate } from "class-validator";
import UserService from "../services/user.service";
import logger from "../../utils/loggers/userLogger";

import { DATA_STORE } from "../../utils/config";
import * as bcrypt from "bcrypt";
import { getRequestId } from "../../utils/app-utils";
import IUser from "../../types/IUsers";
import UserDataSQLStore from "../../datastore/UserDataSQLStore";
import User, { UserType } from "../../entities/user.entity";
import { plainToClass } from "class-transformer";
import userService from "../services/user.service";

export class UserController {
  create = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      // TODO: check Id and userId are required
      const { userData, userId } = req.body;

      const userInput = plainToClass(User, userData);
      userInput.type = UserType.Employee;
      logger.info(userInput, "create user");

      const result = await userService.create(userId, userInput);
      console.log("asdasdad", result);
      if (result instanceof Error) {
        throw result;
      }

      res.statusCode = 201;
      res.json({
        user: result,
      });
    } catch (err) {
      logger.error({
        requestId,
        error: err,
      });
      res.status(500).send(`Could not create user. Failed with: ${err}`);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      // TODO: check Id and userId are required
      const { userData, userId } = req.body;

      const userInput = plainToClass(User, userData);
      logger.info(userInput, "update user");

      const result = await userService.update(userId, userInput);

      res.statusCode = 201;
      res.json({
        user: result,
      });
    } catch (err) {
      logger.error({
        requestId,
        error: err,
      });
      res.status(500).send(`Could not update user. Failed with: ${err}`);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      const { deleteUserId, userId } = req.body;
      if (!userId) {
        throw new Error("userId is required");
      }
      if (!deleteUserId) {
        throw new Error("deleteUserId is required");
      }

      const r = await UserService.delete(userId, deleteUserId);
      if (r instanceof Error) {
        throw r;
      }

      res.status(200).json(r);
    } catch (err) {
      logger.error({
        requestId,
        error: err,
      });
      res.status(500).send(`Could not delete user. Failed with: ${err}`);
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      console.log("body ", req.body);
      const { userId, storeId, skip = 0, limit = 50 } = req.body;
      if (!userId) {
        throw new Error("userId is required");
      }

      const result = await userService.getAllUser(userId, skip, limit, storeId);
      if (result instanceof Error) {
        throw result;
      }

      res.status(200).json(result);
    } catch (err) {
      logger.error({
        requestId,
        error: err,
      });
      res.status(500).send(`Could not get users. Failed with: ${err}`);
    }
  };
}
export default new UserController();
