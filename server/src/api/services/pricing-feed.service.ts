import logger from "../../utils/logger";
import { getRequestId } from "../../utils/app-utils";
import { DATA_STORE } from "../../utils/config";
import User from "../../entities/user.entity";
import { AppDataSource } from "../../utils/data-source";
import { PricingFeedConnection } from "../../models/page-info";
import PricingFeedDataSQLStore from "../../datastore/PricingFeedDataSQLStore";
import IPricingFeed from "../../types/IPricingFeed";
import PricingFeed from "../../entities/pricing-feed.entity";
import { SearchOptions } from "../../type";
import fs from "fs";
import * as csv from "fast-csv";
import { plainToClass } from "class-transformer";

class PricingFeedService {
  pricingFeedStore: IPricingFeed;

  constructor() {
    if (DATA_STORE === "postgres") {
      this.pricingFeedStore = new PricingFeedDataSQLStore();
    } else {
      throw `unknown data store ${DATA_STORE}`;
    }
  }

  create = async (userId: string, path: string): Promise<boolean | Error> => {
    const requestId = getRequestId();
    try {
      logger.info({ requestId, msg: "CREATE_RECORD" });
      const creator = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!creator) {
        throw new Error("user not found!");
      }

      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager
        .getRepository(PricingFeed)
        .delete({ storeId: creator.storeId });

      fs.createReadStream(path)
        .pipe(csv.parse({ headers: true, delimiter: "," }))
        .on("error", (error) => {
          throw error;
        })
        .on("data", async (row: any) => {
          let feed = JSON.stringify(row).replace(/ /g, "");
          feed = JSON.parse(feed);
          const record = plainToClass(PricingFeed, feed);
          // record.price = parseInt(record.price)
          // record.sku = parseInt(record.sku)
          console.log(record);
          //// should we throw error if product exist
          // const existingRecord = await AppDataSource.getRepository(
          //   PricingFeed
          // ).findOneBy({
          //   storeId: creator.storeId,
          //   productName: record.productName
          // });
          // if (existingRecord) {
          //   throw new Error(
          //     "product name already exist for the given store. Please use different product name."
          //   );
          // }

          await this.pricingFeedStore.createRecord(
            queryRunner,
            record.storeId,
            record.productName,
            record.sku,
            record.price,
            record.currency,
            userId,
            undefined,
            new Date(),
            undefined
          );
        })
        .on("end", async (rowCount: number) => {
          console.log(`Parsed ${rowCount} rows`);
          try {
            await queryRunner.commitTransaction();
            return Promise.resolve(true);
          } catch (err: any) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
            console.log("failed create records ", err);
            return Promise.resolve(err);
          } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
          }
        });

      return Promise.resolve(true);
    } catch (err: any) {
      logger.info({ requestId, err });
      return Promise.resolve(err);
    }
  };

  update = async (
    userId: string,
    records: PricingFeed[]
  ): Promise<boolean | Error> => {
    const requestId = getRequestId();
    logger.info({ requestId, msg: "UPDATE_RECORD" });

    if (!records.length) {
      throw new Error(`records data is empty!`);
    }
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const creator = await queryRunner.manager.getRepository(User).findOne({
      where: { id: userId },
    });
    if (!creator) {
      throw new Error("admin not found!");
    }

    try {
      let updatePromises = records.map(async (record) => {
        if (!record.id) {
          throw new Error(
            `Please provide the id in recordData to update the record! ${record}`
          );
        }
        const existingRecord = await queryRunner.manager
          .getRepository(PricingFeed)
          .findOneBy({
            id: record.id,
          });
        if (!existingRecord) {
          throw new Error("Record does not exist!");
        }

        return await this.pricingFeedStore.updateRecord(
          queryRunner,
          record.id,
          existingRecord.storeId,
          record.productName,
          record.sku,
          record.price,
          record.currency,
          existingRecord.createdByUserId,
          userId,
          existingRecord.createdDate,
          new Date()
        );
      });
      await Promise.all(updatePromises);
      await queryRunner.commitTransaction();
      return Promise.resolve(true);
    } catch (err: any) {
      // since we have errors let's rollback changes we made
      logger.info({ requestId, err });
      await queryRunner.rollbackTransaction();
      console.log("failed update records ", err);
      return Promise.resolve(err);
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  };

  getRecords = async (
    userId: string,
    skip?: number,
    limit?: number,
    storeId?: string,
    searchOptions?: SearchOptions
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
      const records = await this.pricingFeedStore.getRecords(
        userId,
        storeId,
        searchOptions,
        skip,
        limit
      );
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
