import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../constants/user-role-type';

@Entity('users')
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 150 })
  @ApiProperty({
    description: 'provide username.',
  })
  username: string;

  @Column('text')
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

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @OneToOne(() => User)
  @Column({
    type: 'integer',
    nullable: true,
  })
  createBy: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  updateAt: Date;

  @OneToOne(() => User)
  @Column({
    type: 'integer',
    nullable: true,
  })
  updateBy: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  deleteAt: Date;

  @OneToOne(() => User)
  @Column({
    type: 'integer',
    nullable: true,
  })
  deleteBy: number;

  @Column({ default: false })
  isDelete: boolean;
}
