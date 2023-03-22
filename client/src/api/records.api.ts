import axios, { AxiosResponse } from "axios";
import IUser from "../types/IUser";
import { API_URL, AUTH_URL } from "../config";
import { User } from "../redux-store/user.reducer";
import { LoginResponse, PricingPage, SearchOptions, UserPage } from "../types/type";
import { setAuthHeaders } from "./rest";
import IPricingFeed from "../types/IPricingFeed";
import { PricingRecord } from "../redux-store/records.reducer";

class RecordsService implements IPricingFeed {
  async getRecords(creatorId: string, storeId?: string | undefined, searchOptions?: SearchOptions,  skip?: number | undefined, limit?: number | undefined): Promise<Error | PricingPage> {
    try {
      let url = `${API_URL}/store/records`;
      let options = {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      };

      const response: AxiosResponse<PricingPage> = await axios.post(
        url,
        { userId: creatorId, storeId, searchOptions, skip, limit },
        setAuthHeaders(options)
      );
      //   const response: any = await handleApiCall({url, body: {userId: creatorId, storeId},options: setAuthHeaders(options) })
      const users: PricingPage = await response.data;
      console.log("users ", users);
      return users;
    } catch (error) {
      throw new Error('error');
    }
  }
  async createRecords( creatorId: string, csvFile: File): Promise<boolean | Error> {
    try {
      let url = `${API_URL}/store`;
      let options = {
        headers: {
          "content-type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      };
      const formData = new FormData();
      // formData.append('name', "pricing_feed");
      formData.append('file', csvFile)
      formData.append('userId', creatorId)

      const response: boolean = await axios.post(
        url,
        formData,
        setAuthHeaders(options)
      );
      
      console.log("records ", response);
      return response;
    } catch (error) {
      throw error
    }
  }
  
  async updatedRecords(creatorId: string, records: PricingRecord[]): Promise<boolean | Error> {
    try {
      let url = `${API_URL}/store`;
      let options = {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      };

      const response: boolean = await axios.put(
        url,
        { userId: creatorId, records },
        setAuthHeaders(options)
      );
      
      console.log("records ", response);
      return response;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  
}

const recordsService = new RecordsService();
export default recordsService;
