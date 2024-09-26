import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  OWNER = 'owner',
  STAFF = 'staff',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 150 })
  username: string;

  @Column('text')
  password: string;

  @Column('varchar', { length: 256 })
  email: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  phonenumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  role: UserRole;
}
