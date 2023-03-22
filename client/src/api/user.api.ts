import axios, { AxiosResponse } from "axios";
import IUser from "../types/IUser";
import { API_URL, AUTH_URL } from "../config";
import { User } from "../redux-store/user.reducer";
import { LoginResponse, UserPage } from "../types/type";
import { setAuthHeaders } from "./rest";

class UserService implements IUser {
  async login(email: string, password: string): Promise<LoginResponse | Error> {
    try {
      console.log("login ", AUTH_URL);
      let url = `${AUTH_URL}/login`;
      const response: AxiosResponse<LoginResponse> = await axios.post(url, {
        email,
        password,
      });
      const user: LoginResponse = await response.data;
      console.log("users ", user);
      return user;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getUsers(creatorId: string, storeId?: string): Promise<UserPage | Error> {
    try {
      let url = `${API_URL}/user/all`;
      let options = {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      };

      const response: AxiosResponse<UserPage> = await axios.post(
        url,
        { userId: creatorId, storeId },
        setAuthHeaders(options)
      );
      //   const response: any = await handleApiCall({url, body: {userId: creatorId, storeId},options: setAuthHeaders(options) })
      const users: UserPage = await response.data;
      console.log("users ", users);
      return users;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async create(userData: User, creatorId: string): Promise<User | Error> {
    let url = `${API_URL}/user/`;
    let options = {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response: AxiosResponse<User> = await axios.post(
      url,
      { userId: creatorId, userData: userData },
      setAuthHeaders(options)
    );
    return response.data;
  }
  async update(userData: User, creatorId: string): Promise<User | Error> {
    let url = `${API_URL}/user/`;
    let options = {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response: AxiosResponse<User> = await axios.put(
      url,
      { userId: creatorId, userData: userData },
      setAuthHeaders(options)
    );
    return response.data;
  }
  async delete(
    creatorId: string,
    deleteUserId: string
  ): Promise<boolean | Error> {
    let url = `${API_URL}/user`;
    let options = {
      data: { userId: creatorId, deleteUserId },
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response: AxiosResponse<boolean> = await axios.delete(
      url,
      setAuthHeaders(options)
    );
    return response.data;
  }
}

const userService = new UserService();
export default userService;
