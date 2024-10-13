import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemTable1728830396203 implements MigrationInterface {
  name = 'CreateOrderItemTable1728830396203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "orderItem" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "quantity" integer NOT NULL DEFAULT '1', "createdById" integer, "updatedById" integer, "deletedById" integer, "orderId" integer NOT NULL, "inventoryId" integer NOT NULL, CONSTRAINT "PK_fe5c4758e5f47a681deb1065c92" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" ADD CONSTRAINT "FK_dc964e64a2e43abc1951f21be9c" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" ADD CONSTRAINT "FK_b18442202d9be4ac8e93290fe3b" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" ADD CONSTRAINT "FK_728952f2f07d8a9393c1e458e37" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" ADD CONSTRAINT "FK_ef8ed42ef2c6feafd1447d96279" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" ADD CONSTRAINT "FK_c7a37020a655158a568aa8be361" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orderItem" DROP CONSTRAINT "FK_c7a37020a655158a568aa8be361"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" DROP CONSTRAINT "FK_ef8ed42ef2c6feafd1447d96279"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" DROP CONSTRAINT "FK_728952f2f07d8a9393c1e458e37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" DROP CONSTRAINT "FK_b18442202d9be4ac8e93290fe3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" DROP CONSTRAINT "FK_dc964e64a2e43abc1951f21be9c"`,
    );
    await queryRunner.query(`DROP TABLE "orderItem"`);
  }
}
