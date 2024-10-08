import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserAuditTrackingModel } from '../../../baseModels/userAuditTrackingModel';
import { Product } from '../../product/entities/product.entity';

@Entity('inventory')
export class Inventory extends UserAuditTrackingModel {
  @Column({
    default: 0,
  })
  quantity: number;

  @OneToOne(() => Product)
  @JoinColumn()
  productId: number;
}
