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
} from 'typeorm';
import { IsEmail } from 'class-validator';

export enum UserType {
  Admin = "Admin",
  Employee = "Employee",
}

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("enum", { default: UserType.Employee, enum: UserType })
  type!: UserType;

  @Column({ name: "name", nullable: false })
  name!: string;

  @Column({ nullable: true })
  contactNumber!: string;

  @IsEmail()
  @Column({ name: "email", nullable: false })
  @Index({ unique: true })
  email!: string;

  @Column({name: "password", nullable: false })
  password!: string

  @Column({nullable: true})
  refreshToken!: string

  @Column({ nullable: true })
  designation!: string;

  @Column({ nullable: true })
  storeId?: string;

  @Column({ nullable: true })
  createdByUserId!: string;

  @Column({
    type: "timestamp",
    default: () => "NOW()::timestamp",
  })
  createdDate!: Date;

  @Column({default: true})
  isActive!: boolean;
}
