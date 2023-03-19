import PricingFeed, { Currency } from "../entities/pricing-feed.entity";
import { PricingFeedConnection } from "../models/page-info";
import IPricingFeed from "../types/IPricingFeed";
import { getPageInfo } from "../utils/app-utils";
import { AppDataSource } from "../utils/data-source";

export default class PricingFeedDataSQLStore implements IPricingFeed {
 
  getRecords = async (
    userId?: string,
    skip?: number,
    limit?: number
  ): Promise<PricingFeedConnection | null> => {
    const qb = AppDataSource.getRepository(PricingFeed)
    .createQueryBuilder("record")
    .select();

    if (userId) {
      qb.where("record.userId = :userId").setParameter("userId", userId);
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
    storeId: string,
    productName: string,
    sku: number,
    price: number,
    currency: string,
    createdByUserId: string,
    editedByUserId: string | undefined,
    createdDate: Date,
    editeddDate: Date
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
    const result = await AppDataSource.getRepository(PricingFeed).create(record)
    if(result.id){
        return result
    }else {
        return undefined
    }
  }


  updateRecord = async (
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
  ): Promise<PricingFeed | undefined> => {
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
    const result = await AppDataSource.getRepository(PricingFeed).update({id}, record)
    if(result.affected){
        return record
    }else {
        return undefined
    }
  }

  search = async( 
    storeId: string,
    skip: number,
    limit: number,    
    productNameQuery?: string,
    skuQuery?: string,
    priceQuery?: string,
  ): Promise<PricingFeedConnection | null> => {
    const qb = AppDataSource.getRepository(PricingFeed)
    .createQueryBuilder("record")
    .select()
    .where('record.storeId = :storeId').setParameter("storeId", storeId);

    if (productNameQuery) {
      qb.andWhere("record.product_name LIKE %productNameQuery%").setParameter("productNameQuery", productNameQuery);
    } 
    if (skuQuery) {
      qb.andWhere("CONVERT(varchar(20), record.sku) LIKE %skuQuery%").setParameter("skuQuery", skuQuery);
    }
    if (skuQuery) {
      qb.andWhere("CONVERT(varchar(20), record.price) LIKE %priceQuery%").setParameter("priceQuery", priceQuery);
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
}
