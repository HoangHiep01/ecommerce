import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductTable41727773428664 implements MigrationInterface {
  name = 'AddProductTable41727773428664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDelete" boolean NOT NULL DEFAULT false, "name" character varying(150) NOT NULL, "description" text NOT NULL, "price" money NOT NULL, "createById" integer, "updateById" integer, "deleteById" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_0c00cd2f24bc561a9faf861d8d4" FOREIGN KEY ("createById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_590f8c980f6b95cbb78a384aa25" FOREIGN KEY ("updateById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_6e4961318f4b7f54ac96c24bc5a" FOREIGN KEY ("deleteById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_6e4961318f4b7f54ac96c24bc5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_590f8c980f6b95cbb78a384aa25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_0c00cd2f24bc561a9faf861d8d4"`,
    );
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
