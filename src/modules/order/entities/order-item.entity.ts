import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { UserAuditTrackingModel } from '../../../baseModels/userAuditTrackingModel';

@Entity('orderItem')
export class OrderItem extends UserAuditTrackingModel {
  @ManyToOne(() => Order)
  @JoinColumn()
  order: number;

  @ManyToOne(() => Inventory)
  @JoinColumn()
  inventory: number;

  @Column({
    default: 0,
  })
  quantity: number;
}
