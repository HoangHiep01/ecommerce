import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { UserAuditTrackingModel } from '../../../baseModels/userAuditTrackingModel';

@Entity('cartItem')
export class CartItem extends UserAuditTrackingModel {
  @ManyToOne(() => Cart)
  @JoinColumn()
  cart: number;

  @ManyToOne(() => Inventory)
  @JoinColumn()
  inventory: number;

  @Column({
    default: 0,
  })
  quantity: number;
}
