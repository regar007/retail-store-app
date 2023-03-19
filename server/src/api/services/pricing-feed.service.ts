import IUser from "../../types/IUsers";
import UserDataSQLStore from "../../datastore/UserDataSQLStore";
import logger from "../../utils/logger";
import { getRequestId } from "../../utils/app-utils";
import { DATA_STORE } from "../../utils/config";
import User from "../../entities/user.entity";
import { AppDataSource } from "../../utils/data-source";
import { PricingFeedConnection, UserConnection } from "../../models/page-info";
import PricingFeedDataSQLStore from "../../datastore/PricingFeedDataSQLStore";
import IPricingFeed from "../../types/IPricingFeed";
import PricingFeed from "../../entities/pricing-feed.entity";

class PricingFeedService {
  pricingFeedStore: IPricingFeed;

  constructor() {
    if (DATA_STORE === "postgres") {
      this.pricingFeedStore = new PricingFeedDataSQLStore();
    } else {
      throw `unknown data store ${DATA_STORE}`;
    }
  }

  create = async (userId: string, recordInput: PricingFeed): Promise<PricingFeed | Error> => {
    const requestId = getRequestId();
    try {
      logger.info({ requestId, msg: "CREATE_RECORD" });
      const creator = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!creator) {
        throw new Error("user not found!");
      }
      const existingRecord = await AppDataSource.getRepository(PricingFeed).findOneBy({
         storeId: recordInput.storeId, productName: recordInput.productName 
      });
      if (existingRecord) {
        throw new Error(
          "product name already exist for the given store. Please use different product name."
        );
      }

      const result = await this.pricingFeedStore.createRecord(
        recordInput.storeId,
        recordInput.productName,
        recordInput.sku,
        recordInput.price,
        recordInput.currency,
        userId,
        undefined,
        new Date(),
        new Date()
      );

      if (result instanceof Error) {
        logger.error({ requestId, msg: result });
      }
      if (!result) {
        let msg = "could not create user";
        logger.error({ requestId, msg });
        throw new Error(msg);
      }

      logger.info({ requestId, result });

      return Promise.resolve(result);
    } catch (err: any) {
      logger.info({ requestId, err });
      return Promise.resolve(err);
    }
  };

  update = async (userId: string, recordInput: PricingFeed): Promise<PricingFeed | Error> => {
    const requestId = getRequestId();
    try {
      logger.info({ requestId, msg: "UPDATE_RECORD" });

      if (!recordInput.id) {
        throw new Error(
          `Please provide the id in recordData to update the record!`
        );
      }
      const creator = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!creator) {
        throw new Error("admin not found!");
      }
      const existingRecord = await AppDataSource.getRepository(PricingFeed).findOneBy({
        id: recordInput.id,
      });
      if (!existingRecord) {
        throw new Error("Record does not exist!");
      }

      const result = await this.pricingFeedStore.updateRecord(
        recordInput.id,
        existingRecord.storeId,
        recordInput.productName,
        recordInput.sku,
        recordInput.price,
        recordInput.currency,
        existingRecord.createdByUserId,
        userId,
        existingRecord.createdDate,
        new Date()
      );

      if (result instanceof Error) {
        logger.error({ requestId, msg: result });
      }
      if (!result) {
        let msg = "could not create user";
        logger.error({ requestId, msg });
        throw new Error(msg);
      }

      logger.info({ requestId, result });

      return Promise.resolve(result);
    } catch (err: any) {
      logger.info({ requestId, err });
      return Promise.resolve(err);
    }
  };


  search = async (
    userId: string,
    skip: number,
    limit: number,
    productNameQuery?: string,
    skuQuery?: string,
    priceQuery?: string,
  ): Promise<PricingFeedConnection | null> => {
    const requestId = getRequestId();
    try {
      logger.info({ requestId, msg: "SEARCH_RECORDS" });
      const searcher = await AppDataSource.getRepository(User).findOneBy({
        id: userId,
      });
      if (!searcher) {
        throw new Error("user not found!");
      }
      const records = await this.pricingFeedStore.search(searcher.storeId || '', skip, limit, productNameQuery, skuQuery, priceQuery);
      if (records instanceof Error) {
        logger.error({ requestId, msg: records });
      }
      if (!records) {
        let msg = "could not search records";
        logger.error({ requestId, msg });
        throw new Error(msg);
      }

      return records;
    } catch (error: any) {
      return error;
    }
  };
}
export default new PricingFeedService();
