import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractUserTrackingEntity } from '../../../common/abstract.user-tracking.entity';

// deal with circular references
// import { User } from '../../users/entities/user.entity';

@Entity('customers')
export class Customer extends AbstractUserTrackingEntity {
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
