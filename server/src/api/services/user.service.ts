import IUser from "../../types/IUsers";
import UserDataSQLStore from "../../datastore/UserDataSQLStore";
import logger from "../../utils/logger";
import { getRequestId } from "../../utils/app-utils";
import { DATA_STORE } from "../../utils/config";
import User, { UserType } from "../../entities/user.entity";
import { AppDataSource } from "../../utils/data-source";
import { UserConnection } from "../../models/page-info";
import * as bcrypt from 'bcrypt';

class UserService {
  userSQLStore: IUser;

  constructor() {
    if (DATA_STORE === "postgres") {
      this.userSQLStore = new UserDataSQLStore();
    } else {
      throw `unknown data store ${DATA_STORE}`;
    }
  }

  create = async (userId: string, userInput: User): Promise<User | Error> => {
    const requestId = getRequestId();
    try {
      logger.info({ requestId, msg: "CREATE_USER" });
      const creator = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!creator || creator.type !== UserType.Admin) {
        throw new Error("admin not found!");
      }
      const existingUser = await AppDataSource.getRepository(User).findOneBy({
        email: userInput.email,
      });
      if (existingUser) {
        throw new Error(
          "Email already in use. Please use different email address."
        );
      }
      const hashedPassword = bcrypt.hashSync(userInput.password, 10);
      const result = await this.userSQLStore.createUser(
        userInput.name,
        userInput.type,
        userInput.contactNumber,
        userInput.email,
        hashedPassword,
        userInput.designation,
        userInput.storeId || "",
        userId,
        new Date(),
        true
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

  update = async (userId: string, userInput: User): Promise<User | Error> => {
    const requestId = getRequestId();
    try {
      logger.info({ requestId, msg: "UPDATE_USER" });

      if (!userInput.id) {
        throw new Error(
          `Please provide the id in userData to update the user!`
        );
      }
      const creator = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!creator || creator.type !== UserType.Admin) {
        throw new Error("admin not found!");
      }
      const existingUser = await AppDataSource.getRepository(User).findOneBy({
        id: userInput.id,
      });
      if (!existingUser) {
        throw new Error("User does not exist!");
      }

      const hashedPassword = userInput.password?.length && userInput.password !== existingUser.password ? bcrypt.hashSync(userInput.password, 10) : existingUser.password;

      const result = await this.userSQLStore.updateUser(
        userInput.id,
        userInput.name,
        userInput.type,
        userInput.contactNumber,
        userInput.email,
        hashedPassword,
        userInput.designation,
        userInput.storeId || "",
        userInput.createdByUserId,
        new Date(),
        userInput.isActive
      );

      if (result instanceof Error) {
        logger.error({ requestId, msg: result });
      }
      if (!result) {
        let msg = "could not update user";
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

  delete = async (
    adminUserId: string,
    deleteUserId: string
  ): Promise<Error | boolean | null> => {
    const requestId = getRequestId();
    try {
      logger.info({ requestId, msg: "DELETE_USER" });
      const creator = await AppDataSource.getRepository(User).findOneBy({
        id: adminUserId,
      });
      if (!creator || creator.type !== UserType.Admin) {
        throw new Error("admin not found!");
      }
      const deletableUser = await this.userSQLStore.deleteUser(deleteUserId);
      if (!deletableUser) {
        throw new Error("user not found!");
      }

      return deletableUser;
    } catch (error: any) {
      logger.info({ requestId, error });
      return Promise.resolve(error);
    }
  };

  getAllUser = async (
    adminUserId: string,
    skip: number,
    limit: number,
    storeId?: string,
  ): Promise<UserConnection | null> => {
    const requestId = getRequestId();
    try {
      logger.info({ requestId, msg: "GET_USERS" });
      const creator = await AppDataSource.getRepository(User).findOneBy({
        id: adminUserId,
      });
      if (!creator || creator.type !== UserType.Admin) {
        throw new Error("admin not found!");
      }
      const users = await this.userSQLStore.getUsers(storeId, skip, limit);
      return users;
    } catch (error: any) {
      logger.info({ requestId, error });
      return Promise.resolve(error);
    }
  };
}
export default new UserService();
