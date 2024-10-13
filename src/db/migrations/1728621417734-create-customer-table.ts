import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerTable1728621417734 implements MigrationInterface {
  name = 'CreateCustomerTable1728621417734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "address" text NOT NULL, "email" character varying(256) NOT NULL, "phoneNumber" character varying NOT NULL, "createdById" integer, "updatedById" integer, "deletedById" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_aa88a28eac26e514147fc7d2039" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_5ecf24c76197e0f9b4fe1741bb1" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_437ce279f146b9fea39dbd35c18" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_437ce279f146b9fea39dbd35c18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_5ecf24c76197e0f9b4fe1741bb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_aa88a28eac26e514147fc7d2039"`,
    );
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
