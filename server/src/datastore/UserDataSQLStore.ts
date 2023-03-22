import moment from "moment";
import { QueryRunner, getConnection } from "typeorm";
import User, { UserType } from "../entities/user.entity";
import { ConnectionResult, UserConnection } from "../models/page-info";
import IUser from "../types/IUsers";
import { getPageInfo } from "../utils/app-utils";
import { AppDataSource } from "../utils/data-source";

export default class UserDataSQLStore implements IUser {

  deleteUser = async (id: string): Promise<boolean | null> => {
    const result = await AppDataSource.getRepository(User).delete({ id: id });
    if (result.affected && result.affected > 0) {
      return true;
    } else {
      return false;
    }
  };

  createUser = async (
    name: string,
    type: UserType,
    contactNumber: string,
    email: string,
    password: string,
    designation: string,
    storeId: string,
    createdByUserId: string,
    createdDate: Date,
    isActive: boolean
  ): Promise<User | undefined> => {
    let user = new User()
    user.name = name
    user.type = type
    user.contactNumber = contactNumber
    user.email = email
    user.password = password
    user.designation = designation
    user.storeId = storeId
    user.createdByUserId = createdByUserId
    user.createdDate = createdDate
    user.isActive = isActive
    console.log('createUser ', user)
    const result = await AppDataSource.getRepository(User).save(user)
    console.log('result ', result)
    if(result.id){
        result.password = ""
        return result
    }else {
        return undefined
    }
  }

  updateUser = async (
    id: string,
    name: string,
    type: UserType,
    contactNumber: string,
    email: string,
    password: string,
    designation: string,
    storeId: string,
    createdByUserId: string,
    createdDate: Date,
    isActive: boolean
  ): Promise<User | undefined> => {
    let user = new User()
    user.id = id
    user.name = name
    user.type = type
    user.contactNumber = contactNumber
    user.email = email
    user.password = password
    user.designation = designation
    user.storeId = storeId
    user.createdByUserId = createdByUserId
    user.createdDate = createdDate
    user.isActive = isActive
    const result = await AppDataSource.getRepository(User).update({id}, user)
    if(result.affected){
        user.password = ""
        return user
    }else {
        return undefined
    }
  }

  getUsers = async (
    storeId?: string,
    skip?: number,
    limit?: number
  ): Promise<UserConnection | null> => {
    const qb = AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .select();

    if (storeId) {
      qb.where("user.storeId = :storeId").setParameter("storeId", storeId);
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
  };

}
