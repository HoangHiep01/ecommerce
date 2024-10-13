import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartTable1728662995985 implements MigrationInterface {
  name = 'CreateCartTable1728662995985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "createdById" integer, "updatedById" integer, "deletedById" integer, "customerId" integer, CONSTRAINT "REL_eac3d1f269ffeb0999fbde0185" UNIQUE ("customerId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_eaca17862ea338f633669c95211" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_476b318963147ddc70f5f973ea1" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_a2e910524a548cb7a0211ffd846" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_eac3d1f269ffeb0999fbde0185b" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_eac3d1f269ffeb0999fbde0185b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_a2e910524a548cb7a0211ffd846"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_476b318963147ddc70f5f973ea1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_eaca17862ea338f633669c95211"`,
    );
    await queryRunner.query(`DROP TABLE "cart"`);
  }
}
