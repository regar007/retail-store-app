import { QueryRunner } from "typeorm";
import PricingFeed, { Currency } from "../entities/pricing-feed.entity";
import { PricingFeedConnection } from "../models/page-info";
import { SearchOptions } from "../type";
import IPricingFeed from "../types/IPricingFeed";
import { getPageInfo } from "../utils/app-utils";
import { AppDataSource } from "../utils/data-source";

export default class PricingFeedDataSQLStore implements IPricingFeed {
 
  getRecords = async (
    userId?: string,
    storeId?: string,
    searchOptions?: SearchOptions,
    skip?: number,
    limit?: number
  ): Promise<PricingFeedConnection | null> => {
    console.log('getRecords searchOptions', searchOptions)

    const qb = AppDataSource.getRepository(PricingFeed)
    .createQueryBuilder("record")
    .select();

    if(storeId){
      qb.where('record.storeId = :storeId').setParameter("storeId", storeId);
    }

    if (userId) {
      qb.andWhere("record.created_by_user_id = :userId").setParameter("userId", userId);
    }

    if (searchOptions?.productName) {
      qb.andWhere("record.product_name LIKE :productName").setParameter("productName", `%${searchOptions?.productName}%`);
    } 
    if (searchOptions?.price) {
      qb.andWhere("CAST(record.price AS TEXT) LIKE :price").setParameter("price", `%${searchOptions?.price}%`);
    }
    if (searchOptions?.sku) {
      qb.andWhere("CAST(record.sku AS TEXT) LIKE :sku").setParameter("sku", `%${searchOptions?.sku}%`);
    }

    if (skip !== undefined) {
      qb.offset(skip);
    }
    if (limit !== undefined) {
      qb.limit(limit);
    }
    

    const [nodes, totalCount] = await qb.getManyAndCount();

    return {
      nodes,
      pageInfo: getPageInfo(totalCount, limit, skip),
    };
  }


  createRecord = async(
    qb: QueryRunner,
    storeId: string,
    productName: string,
    sku: number,
    price: number,
    currency: string,
    createdByUserId: string,
    editedByUserId: string | undefined,
    createdDate: Date,
    editeddDate?: Date
  ): Promise<PricingFeed | undefined> => {
    let record = new PricingFeed()
    record.productName = productName
    record.sku = sku
    record.price = price
    record.currency = currency as Currency
    record.storeId = storeId
    record.createdByUserId = createdByUserId
    record.editedByUserId = editedByUserId
    record.createdDate = createdDate
    record.editeddDate = editeddDate
    const result = await qb.manager.save(record)
    if(result.id){
        return result
    }else {
        throw new Error(`failed to create ${productName} `)
    }
  }


  updateRecord = async (
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
  ): Promise<PricingFeed> => {
    let record = new PricingFeed()
    record.id = id
    record.productName = productName
    record.sku = sku
    record.price = price
    record.currency = currency as Currency
    record.storeId = storeId
    record.createdByUserId = createdByUserId
    record.editedByUserId = editedByUserId
    record.createdDate = createdDate
    record.editeddDate = editeddDate
    await qb.manager.getRepository(PricingFeed).update({id}, record)
    return record
  }
    

  search = async( 
    storeId: string,
    skip: number,
    limit: number,    
    productNameQuery?: string,
    skuQuery?: string,
    priceQuery?: string,
  ): Promise<PricingFeedConnection | null> => {
    throw new Error('not implemented')
  }
}
