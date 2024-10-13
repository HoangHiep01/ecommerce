import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartItemTable1728664465837 implements MigrationInterface {
  name = 'CreateCartItemTable1728664465837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cartItem" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "quantity" integer NOT NULL DEFAULT '1', "createdById" integer, "updatedById" integer, "deletedById" integer, "cartId" integer NOT NULL, "inventoryId" integer NOT NULL, CONSTRAINT "PK_56da2bf3db528f1d91566fd46e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" ADD CONSTRAINT "FK_09f4a6de98d6defd78320a4d5af" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" ADD CONSTRAINT "FK_be4a6b4762ba68008f9f75ba420" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" ADD CONSTRAINT "FK_2719d84438375726e21c7e1a4f1" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" ADD CONSTRAINT "FK_758a7aa44831ea2e513bb435acd" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" ADD CONSTRAINT "FK_c56be34cbe5ada1f8a1dac0e32e" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cartItem" DROP CONSTRAINT "FK_c56be34cbe5ada1f8a1dac0e32e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" DROP CONSTRAINT "FK_758a7aa44831ea2e513bb435acd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" DROP CONSTRAINT "FK_2719d84438375726e21c7e1a4f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" DROP CONSTRAINT "FK_be4a6b4762ba68008f9f75ba420"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" DROP CONSTRAINT "FK_09f4a6de98d6defd78320a4d5af"`,
    );
    await queryRunner.query(`DROP TABLE "cartItem"`);
  }
}
