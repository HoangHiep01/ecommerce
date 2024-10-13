import { Entity, Column, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../constants/user-role-type';
import { AbstractUserTrackingEntity } from '../../../common/abstract.user-tracking.entity';

@Entity('users')
@Unique(['userName', 'email'])
export class User extends AbstractUserTrackingEntity {
  @Column('varchar', { length: 150 })
  @ApiProperty({
    description: 'provide username.',
  })
  userName: string;

  @Column('text', { select: false })
  @ApiProperty({
    description: 'provide password.',
  })
  password: string;

  @Column('varchar', { length: 256 })
  @ApiProperty({
    description: 'provide email.',
  })
  email: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'provide phoneumber.',
  })
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  @ApiProperty({
    description: 'provide user role.',
  })
  role: UserRole;
}
