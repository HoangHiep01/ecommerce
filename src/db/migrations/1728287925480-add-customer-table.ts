import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerTable1728287925480 implements MigrationInterface {
  name = 'AddCustomerTable1728287925480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDelete" boolean NOT NULL DEFAULT false, "name" character varying(150) NOT NULL, "address" text NOT NULL, "email" character varying(256) NOT NULL, "phoneNumber" character varying NOT NULL, "createById" integer, "updateById" integer, "deleteById" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_0cbbf46335725c4478eb5f10cd2" FOREIGN KEY ("createById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_883a98dc71f079657d23c383f78" FOREIGN KEY ("updateById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_eafccae024d07e0c8755ae46617" FOREIGN KEY ("deleteById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_eafccae024d07e0c8755ae46617"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_883a98dc71f079657d23c383f78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_0cbbf46335725c4478eb5f10cd2"`,
    );
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
