import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { UserAuditTrackingModel } from '../../../baseModels/userAuditTrackingModel';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('cart')
export class Cart extends UserAuditTrackingModel {
  @OneToOne(() => Customer)
  @JoinColumn()
  customer: number;
}
