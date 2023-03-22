import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index,
  PrimaryColumn,
} from "typeorm";
import { IsEmail } from "class-validator";

export enum Currency {
  INR = "INR",
  DOLLER = "DOLLER",
  EURO = "EURO",
}

@Entity()
export default class PricingFeed extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: false })
  storeId!: string;

  @Column({ name: "product_name", default: '' })
  productName!: string;

  @Column({ nullable: false, default: 0 })
  sku!: number;

  @Column({ nullable: false, default: 0 })
  price!: number;

  @Column("enum", { name: "currency", default: Currency.INR, enum: Currency })
  currency!: Currency;

  @Column({ name: "created_by_user_id", nullable: true })
  createdByUserId!: string;

  @Column({ name: "edited_by_user_id", nullable: true })
  editedByUserId?: string;

  @Column({
    type: "timestamp",
    name: "created_date",
    default: () => "NOW()::timestamp",
  })
  createdDate!: Date;

  @Column({
    type: "timestamp",
    name: "edited_date",
    default: () => "NOW()::timestamp",
    nullable: true
  })
  editeddDate?: Date;

}
