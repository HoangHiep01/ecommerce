import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { AbstractUserTrackingEntity } from '../../../common/abstract.user-tracking.entity';

@Entity('orderItem')
export class OrderItem extends AbstractUserTrackingEntity {
  @ApiProperty({
    description: 'Link to order.',
  })
  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn()
  order: Order;

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
