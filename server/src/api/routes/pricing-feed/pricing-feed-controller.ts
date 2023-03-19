import { Request, Response } from "express";
import { validate } from "class-validator";
import UserService from "../../services/user.service";
import logger from "../../../utils/loggers/userLogger";

import { DATA_STORE } from "../../../utils/config";
import * as bcrypt from "bcrypt";
import { getRequestId } from "../../../utils/app-utils";
import IUser from "../../../types/IUsers";
import UserDataSQLStore from "../../../datastore/UserDataSQLStore";
import User from "../../../entities/user.entity";
import { plainToClass } from "class-transformer";
import userService from "../../services/user.service";
import PricingFeed from "../../../entities/pricing-feed.entity";
import pricingFeedService from "../../services/pricing-feed.service";

export class PricingFeedController {
  create = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      // TODO: check Id and userId are required
      const { recordData, userId } = req.body;

      const recordInput = plainToClass(PricingFeed, recordData);
      logger.info(recordInput, "create record");

      const result = await pricingFeedService.create(userId, recordInput);

      res.statusCode = 201;
      res.json({
        user: result,
      });
    } catch (err) {
      if (err instanceof Error) {
        res.send(err);
      } else {
        logger.error({
          requestId,
          error: err,
        });
        res.sendStatus(500).send(`Could not create record. Failed with: ${err}`);
      }
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId();
    try {
      // TODO: check Id and userId are required
      const { recordData, userId } = req.body;

      const recordInput = plainToClass(PricingFeed, recordData);
      logger.info(recordInput, "update record");

      const result = await pricingFeedService.update(userId, recordInput);

      res.statusCode = 201;
      res.json({
        user: result,
      });
    } catch (err) {
      if (err instanceof Error) {
        res.send(err);
      } else {
        logger.error({
          requestId,
          error: err,
        });
        res.sendStatus(500).send(`Could not update record. Failed with: ${err}`);
      }
    }
  };


  search = async (req: Request, res: Response) :Promise<void> => {
    const requestId = getRequestId();
    try {
      const { userId, productNameQuery, skuQuery, priceQuery, skip = 0, limit = 10 } = req.body;
      if (!userId) {
        throw new Error("userId is required");
      }

      const result = await pricingFeedService.search(userId, skip, limit, productNameQuery, skuQuery, priceQuery)
      if (result instanceof Error) {
        throw result;
      }

      res.sendStatus(200).json(result)
    }catch (err) {
        logger.error({ err });
        if (err instanceof Error) {
          res.send(err);
        } else {
          logger.error({
            requestId,
            error: err,
          });
          res.sendStatus(500).send(`Could not search records. Failed with: ${err}`);
        }
      }
  }



}
export default new PricingFeedController();
