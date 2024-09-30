import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  Column,
} from 'typeorm';
import { BaseModel } from './baseEntity';
import { User } from '../users/entities/user.entity';

export class UserAuditTrackingModel extends BaseModel {
  @CreateDateColumn()
  createAt!: Date;

  @OneToOne(() => User)
  @Column({
    type: 'integer',
    nullable: false,
  })
  createBy: number;

  @UpdateDateColumn()
  updateAt?: Date;

  @OneToOne(() => User)
  @Column({
    type: 'integer',
    nullable: true,
  })
  updateBy: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => User)
  @Column({
    type: 'integer',
    nullable: true,
  })
  deleteBy: number;

  @Column({ default: false })
  isDelete: boolean;
}
