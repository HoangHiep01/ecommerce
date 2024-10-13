import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractUserTrackingEntity } from '../../../common/abstract.user-tracking.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderState } from '../../../constants/order-state';

@Entity('order')
export class Order extends AbstractUserTrackingEntity {
  @ApiProperty({
    description: 'State of order.',
  })
  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.PROCESSING,
  })
  state: OrderState;

  @ApiProperty({
    description: 'Customer of order.',
  })
  @ManyToOne(() => Customer, { eager: true, nullable: false })
  @JoinColumn()
  customer: Customer;
}
