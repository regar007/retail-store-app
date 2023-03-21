import { User } from "../redux-store/user.reducer";

export type LoginResponse = {
  user: User;

  accessToken: string;

  refreshToken: string;
};

export enum UserType {
  "Admin" = "Admin",
  "Employee" = "Employee",
}

type PageInfo = {
  hasNextPage: boolean;

  hasPreviousPage: boolean;
  limit: number;
  skip: number;
  totalCount: number;
}

export type UserPage = {
  nodes: User[];

  pageInfo: PageInfo;
};


export type PricingPage = {
  nodes: User[];

  pageInfo: PageInfo;
};


export type SearchOptions = {
  productName?: string;

  sku?: number;

  price?: number,  
};