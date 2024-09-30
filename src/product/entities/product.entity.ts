import { Entity, Column } from 'typeorm';
import { UserAuditTrackingModel } from '../../baseModels/userAuditTrackingModel';
import 'dotenv/config';

@Entity('products')
export class Product extends UserAuditTrackingModel {
  @Column('varchar', { length: 150 })
  name: string;

  @Column('text')
  description: string;

  @Column('money')
  price: number;
}
