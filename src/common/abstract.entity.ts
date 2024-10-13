import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt?: Date;
}
