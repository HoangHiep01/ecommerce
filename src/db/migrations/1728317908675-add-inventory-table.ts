import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventoryTable1728317908675 implements MigrationInterface {
  name = 'AddInventoryTable1728317908675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDelete" boolean NOT NULL DEFAULT false, "quantity" integer NOT NULL DEFAULT '0', "createById" integer, "updateById" integer, "deleteById" integer, "productIdId" integer, CONSTRAINT "REL_10fc801ef0bb45826a47fb17fe" UNIQUE ("productIdId"), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_188b3262ab218195e39f5f45d7c" FOREIGN KEY ("createById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_076f873a44775bd0918b872345c" FOREIGN KEY ("updateById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_f8987b4b9b4e1de880f5e7e2b79" FOREIGN KEY ("deleteById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_10fc801ef0bb45826a47fb17fe4" FOREIGN KEY ("productIdId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_10fc801ef0bb45826a47fb17fe4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_f8987b4b9b4e1de880f5e7e2b79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_076f873a44775bd0918b872345c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_188b3262ab218195e39f5f45d7c"`,
    );
    await queryRunner.query(`DROP TABLE "inventory"`);
  }
}
