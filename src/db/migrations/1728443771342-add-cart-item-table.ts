import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCartItemTable1728443771342 implements MigrationInterface {
  name = 'AddCartItemTable1728443771342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDelete" boolean NOT NULL DEFAULT false, "createById" integer, "updateById" integer, "deleteById" integer, "customerId" integer, CONSTRAINT "REL_eac3d1f269ffeb0999fbde0185" UNIQUE ("customerId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cartItem" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDelete" boolean NOT NULL DEFAULT false, "quantity" integer NOT NULL DEFAULT '0', "createById" integer, "updateById" integer, "deleteById" integer, "cartId" integer, "inventoryId" integer, CONSTRAINT "PK_56da2bf3db528f1d91566fd46e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_47cd83c1c9099b95c3982e90402" FOREIGN KEY ("createById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_447ca230dc0da3e79c7e19ac2a7" FOREIGN KEY ("updateById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_b146381d770adfa54d431b5bc7e" FOREIGN KEY ("deleteById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_eac3d1f269ffeb0999fbde0185b" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" ADD CONSTRAINT "FK_47dcc77f29b0c23cb2a90618b45" FOREIGN KEY ("createById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" ADD CONSTRAINT "FK_41de6fe07042f7947ed8f0ca55a" FOREIGN KEY ("updateById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" ADD CONSTRAINT "FK_1ecba0c2afcc777081885d99d7e" FOREIGN KEY ("deleteById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "cartItem" DROP CONSTRAINT "FK_1ecba0c2afcc777081885d99d7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" DROP CONSTRAINT "FK_41de6fe07042f7947ed8f0ca55a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cartItem" DROP CONSTRAINT "FK_47dcc77f29b0c23cb2a90618b45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_eac3d1f269ffeb0999fbde0185b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_b146381d770adfa54d431b5bc7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_447ca230dc0da3e79c7e19ac2a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_47cd83c1c9099b95c3982e90402"`,
    );
    await queryRunner.query(`DROP TABLE "cartItem"`);
    await queryRunner.query(`DROP TABLE "cart"`);
  }
}
