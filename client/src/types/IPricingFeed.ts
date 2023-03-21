import { PricingRecord } from "../redux-store/records.reducer";
import { PricingPage, SearchOptions } from "./type";

export default interface IPricingFeed {
  getRecords(
    creatorId: string,
    storeId?: string,
    searchOptions?: SearchOptions,
    skip?: number,
    limit?: number
  ): Promise<PricingPage | Error>;

  createRecords(creatorId: string, csvFile: File): Promise<boolean | Error>;

  updatedRecords(
    creatorId: string,
    records: PricingRecord[]
  ): Promise<boolean | Error>;

}
