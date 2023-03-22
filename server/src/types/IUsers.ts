import User, { UserType } from "../entities/user.entity";
import { ConnectionResult, UserConnection } from "../models/page-info";

export default interface IUser {

  /**
   * Gets the users of given store or all.
   * @param storeId - Store Id
   * @param skip - Skip Count
   * @param limit - Limit Count
   */
  getUsers(
    storeId?: string,
    skip?: number,
    limit?: number
  ): Promise<UserConnection | null>;

  /**
   * Delete the users of given id.
   * @param id - User Id
   */
  deleteUser(id: string): Promise<boolean | null>;

  /**
   * Create the user with given data.
   * @param name - User Name
   * @param storeId - Store Id
   * @param type - User Id
   * @param email - User Email
   * @param password - User Password
   * @param contactNumber - User Contanct Number
   * @param designation - User Designation
   * @param createdByUserId - User Created By
   * @param createdDate - User Created Date
   * @param isActive - User is Active or Not
   */
  createUser(
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
  ): Promise<User | undefined>;

   /**
   * Update the user with given data.
   * @param name - User Name
   * @param storeId - Store Id
   * @param type - User Id
   * @param email - User Email
   * @param password - User Password
   * @param contactNumber - User Contanct Number
   * @param designation - User Designation
   * @param createdByUserId - User Created By
   * @param createdDate - User Created Date
   * @param isActive - User is Active or Not
   */
   updateUser(
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
  ): Promise<User | undefined>;

}
