import { AbstractEntity } from './abstract.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';

export abstract class AbstractUserTrackingEntity extends AbstractEntity {
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  updatedBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  deletedBy: User;
}
