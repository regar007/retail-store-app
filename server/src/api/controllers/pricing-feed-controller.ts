import { Request, Response } from "express";
import { validate } from "class-validator";
import UserService from "../services/user.service";
import logger from "../../utils/loggers/userLogger";

import { DATA_STORE } from "../../utils/config";
import * as bcrypt from "bcrypt";
import { getRequestId } from "../../utils/app-utils";
import IUser from "../../types/IUsers";
import UserDataSQLStore from "../../datastore/UserDataSQLStore";
import User from "../../entities/user.entity";
import { plainToClass } from "class-transformer";
import userService from "../services/user.service";
import PricingFeed from "../../entities/pricing-feed.entity";
import pricingFeedService from "../services/pricing-feed.service";


export class PricingFeedController {
  create = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      const { file, body } = req;
      const userId = body.userId
      console.log("create records", req.file, req.body, userId);
      
      // TODO: check Id and userId are required


      const result = await pricingFeedService.create(userId as string, req.file!.path);
      if (result instanceof Error) {
        console.log('errr ', result)
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
      res.status(500).send(`Could not create record. Failed with: ${err}`);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      // TODO: check Id and userId are required
      const { records, userId } = req.body;

      logger.info(records, "update record");

      const result = await pricingFeedService.update(userId, records);
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
      res.status(500).send(`Could not update record. Failed with: ${err}`);
    }
  };

  getRecords = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      const { userId, storeId, searchOptions, skip = 0, limit = 50 } = req.body;
      if (!userId) {
        throw new Error("userId is required");
      }

      const result = await pricingFeedService.getRecords(
        userId,
        skip,
        limit,
        storeId,
        searchOptions
      );
      if (result instanceof Error) {
        throw result;
      }

      res.status(200).json(result);
    } catch (err) {
      logger.error({
        requestId,
        error: err,
      });
      res.status(500).send(`Could not search records. Failed with: ${err}`);
    }
  };

  search = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      const { userId, storeId, searchOptions, skip = 0, limit = 10 } = req.body;
      if (!userId) {
        throw new Error("userId is required");
      }

      const result = await pricingFeedService.getRecords(
        userId,
        skip,
        limit,
        storeId,
        searchOptions
      );
      if (result instanceof Error) {
        throw result;
      }

      res.status(200).json(result);
    } catch (err) {
      logger.error({
        requestId,
        error: err,
      });
      res.status(500).send(`Could not search records. Failed with: ${err}`);
    }
  };
}
export default new PricingFeedController();
