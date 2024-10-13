import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1728830234202 implements MigrationInterface {
  name = 'CreateOrderTable1728830234202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_state_enum" AS ENUM('processing', 'shipping', 'shipped', 'canceled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "state" "public"."order_state_enum" NOT NULL DEFAULT 'processing', "createdById" integer, "updatedById" integer, "deletedById" integer, "customerId" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_de6fa8b07fd7e0a8bf9edb5eb38" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_8289699b21674ff4897a9406af0" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_de5859c64ed49ebbab2c2e42da6" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_de5859c64ed49ebbab2c2e42da6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_8289699b21674ff4897a9406af0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_de6fa8b07fd7e0a8bf9edb5eb38"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_state_enum"`);
  }
}
