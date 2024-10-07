import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuditTrackingModel } from '../../../baseModels/userAuditTrackingModel';

@Entity('customers')
export class Customer extends UserAuditTrackingModel {
  @ApiProperty({
    description: 'provide full name of customer.',
  })
  @Column('varchar', { length: 150 })
  name: string;

  @ApiProperty({
    description: 'provide customer address for shipping.',
  })
  @Column('text')
  address: string;

  @ApiProperty({
    description: 'provide email.',
  })
  @Column('varchar', { length: 256 })
  email: string;

  @ApiProperty({
    description: 'provide phoneumber.',
  })
  @Column({ nullable: false })
  phoneNumber?: string;
}
