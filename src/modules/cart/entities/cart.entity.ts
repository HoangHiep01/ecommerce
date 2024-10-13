import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractUserTrackingEntity } from '../../../common/abstract.user-tracking.entity';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('cart')
export class Cart extends AbstractUserTrackingEntity {
  @ApiProperty({
    description: 'Customer of cart.',
  })
  @OneToOne(() => Customer, { eager: true })
  @JoinColumn()
  customer: Customer;
}
