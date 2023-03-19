import { User } from "../redux-store/user.reducer";
import { LoginResponse, Page } from "./type";

export default interface IUser {
  login(email: string, password: string): Promise<LoginResponse | Error>;
  getUsers(creatorId: string, storeId?: string): Promise<Page | Error>;

  create(userData: User, creatorId: string): Promise<User | Error>;

  update(userData: User, creatorId: string): Promise<User | Error>;

  delete(creatorId: string, deleteUserId: string): Promise<boolean | Error>;
}
