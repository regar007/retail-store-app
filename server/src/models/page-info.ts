import PricingFeed from "../entities/pricing-feed.entity";
import User from "../entities/user.entity";

export interface ConnectionEdge<E> {
  node: E;
  cursor: string;
}

export interface ConnectionResult<E> {
  nodes: E[]; // list of records returned from the database
  edges?: ConnectionEdge<E>[];
  pageInfo: PageInfo;
}

export class PageInfo {
  limit!: number;

  skip!: number;

  totalCount!: number;

  hasNextPage!: boolean;

  hasPreviousPage!: boolean;
}

export class UserConnection implements ConnectionResult<User | null> {  
    nodes!: User[];

    pageInfo!: PageInfo;
}

export class PricingFeedConnection implements ConnectionResult<PricingFeed | null> {  
  nodes!: PricingFeed[];

  pageInfo!: PageInfo;
}