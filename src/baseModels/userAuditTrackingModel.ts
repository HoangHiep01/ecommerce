import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { BaseModel } from './baseEntity';
import { User } from '../modules/users/entities/user.entity';

export class UserAuditTrackingModel extends BaseModel {
  @CreateDateColumn()
  createAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  createBy!: number;

  @UpdateDateColumn()
  updateAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  updateBy: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  deleteBy: number;

  @Column({ default: false })
  isDelete: boolean;
}
