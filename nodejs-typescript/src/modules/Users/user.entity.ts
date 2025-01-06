// Import necessary modules and decorators
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IUser } from "./user.interface";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", nullable: true })
  fullName!: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth!: Date | string;

  @Column({ type: "enum", enum: ["Male", "Female", "Other"], default: "Other" })
  gender!: "Male" | "Female" | "Other";

  @Column({ type: "varchar", nullable: true })
  phoneNumber!: string;

  @Column({ type: "text", nullable: true })
  address!: string;

  @Column({ type: "varchar", enum: ["User", "Admin", "Moderator"], default: "User" })
  role!: "User" | "Admin" | "Moderator";

  @Column({ type: "boolean", default: false })
  isVerified!: boolean;

  @Column({ type: "varchar", nullable: true })
  verificationCode!: string;

  @Column({type:"varchar",nullable:true})
  salt!: string

  @Column({type:"blob",nullable:true})
  Avatar!:string

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  // constructor(data: IUser) {
  //   Object.assign(this, data);
  // }
}
  

  // @BeforeInsert()
  // public async hashPassword() {
  //   this.password = await hash(this.password, 10);
  // }

