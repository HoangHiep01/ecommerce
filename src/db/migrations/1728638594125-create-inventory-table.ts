import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryTable1728638594125 implements MigrationInterface {
  name = 'CreateInventoryTable1728638594125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "quantity" integer NOT NULL DEFAULT '0', "createdById" integer, "updatedById" integer, "deletedById" integer, "productIdId" integer, CONSTRAINT "REL_10fc801ef0bb45826a47fb17fe" UNIQUE ("productIdId"), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_a35b2af7fa30e71e4229e3d4e22" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_2a708a50461d83a849cc3a1a950" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_7fe5c152b8964c1899fa7776948" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_7fe5c152b8964c1899fa7776948"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_2a708a50461d83a849cc3a1a950"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_a35b2af7fa30e71e4229e3d4e22"`,
    );
    await queryRunner.query(`DROP TABLE "inventory"`);
  }
}
