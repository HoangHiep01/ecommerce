import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cart } from './cart.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { AbstractUserTrackingEntity } from '../../../common/abstract.user-tracking.entity';

@Entity('cartItem')
export class CartItem extends AbstractUserTrackingEntity {
  @ApiProperty({
    description: 'Link to cart.',
  })
  @ManyToOne(() => Cart, { nullable: false })
  @JoinColumn()
  cart: Cart;

  @ApiProperty({
    description: 'Link to product in inventory.',
  })
  @ManyToOne(() => Inventory, { eager: true, nullable: false })
  @JoinColumn()
  inventory: Inventory;

  @ApiProperty({
    description: 'Quantity of product in order.',
  })
  @Column({
    default: 1,
  })
  quantity: number;
}
