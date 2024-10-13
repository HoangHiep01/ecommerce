import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AbstractUserTrackingEntity } from '../../../common/abstract.user-tracking.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('inventory')
export class Inventory extends AbstractUserTrackingEntity {
  @Column({
    default: 0,
  })
  quantity: number;

  @OneToOne(() => Product)
  @JoinColumn()
  productId: number;
}
