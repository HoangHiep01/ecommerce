import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserAuditTrackingModel } from '../../../baseModels/userAuditTrackingModel';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderState } from '../../../constants/order-state';

@Entity('order')
export class Order extends UserAuditTrackingModel {
  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.PROCESSING,
  })
  state: OrderState;

  @OneToOne(() => Customer)
  @JoinColumn()
  customer: number;
}
