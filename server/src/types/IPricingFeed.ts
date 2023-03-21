import User, { UserType } from "../entities/user.entity";
import PricingFeed, { Currency } from "../entities/pricing-feed.entity";
import { ConnectionResult, PricingFeedConnection, UserConnection } from "../models/page-info";
import { SearchOptions } from "../type";
import { QueryRunner } from "typeorm";

export default interface IPricingFeed {

  /**
   * Gets the records of given user.
   * @param userId - User Id
   * @param skip - Skip Count
   * @param limit - Limit Count
   */
  getRecords(
    userId?: string,
    storeId?: string,
    searchOptions?: SearchOptions,
    skip?: number,
    limit?: number
  ): Promise<PricingFeedConnection | null>;


  /**
   * Create the record with given data.
   * @param storeId - Store Id
   * @param productName - Product Name
   * @param sku - SKU
   * @param price - Price
   * @param currency - Currency
   * @param createdByUserId - Created By
   * @param editedByUserId - Edited By
   * @param createdDate - Created Date
   * @param editeddDate - Edited Date
   */
  createRecord(
    qr: QueryRunner,
    storeId: string,
    productName: string,
    sku: number,
    price: number,
    currency: string,
    createdByUserId: string,
    editedByUserId: string | undefined,
    createdDate: Date,
    editeddDate?: Date
  ): Promise<PricingFeed | undefined>;

  /**
   * Update the record with given data.
   * @param id - Record Id
   * @param productName - Product Name
   * @param storeId - Store Id
   * @param sku - SKU
   * @param price - Price
   * @param currency - Currency
   * @param createdByUserId - Created By
   * @param editedByUserId - Edited By
   * @param createdDate - Created Date
   * @param editeddDate - Edited Date
   */
  updateRecord(
    qb: QueryRunner,
    id: string,    
    storeId: string,
    productName: string,
    sku: number,
    price: number,
    currency: string,
    createdByUserId: string,
    editedByUserId: string,
    createdDate: Date,
    editeddDate: Date
  ): Promise<PricingFeed>;

  search(
    storeId:string,
    skip: number,
    limit: number,   
    productName?: string,
    sku?: string,
    price?: string, 
  ): Promise<PricingFeedConnection | null>

}
