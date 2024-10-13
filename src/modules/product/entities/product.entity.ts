import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractUserTrackingEntity } from '../../../common/abstract.user-tracking.entity';

// deal with circular references
// import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product extends AbstractUserTrackingEntity {
  @ApiProperty({
    description: 'provide product name.',
  })
  @Column('varchar', { length: 150 })
  name: string;

  @ApiProperty({
    description: 'provide description about product name.',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'provide product price.',
  })
  @Column('money')
  price: number;
}
