import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueContraintAndFieldsAuditTracking1727522715301
  implements MigrationInterface
{
  name = 'AddUniqueContraintAndFieldsAuditTracking1727522715301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phonenumber"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phoneNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "createBy" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updateAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "updateBy" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "deleteAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "deleteBy" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isDelete" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_772886e2f1f47b9ceb04a06e203" UNIQUE ("username", "email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_772886e2f1f47b9ceb04a06e203"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isDelete"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleteBy"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleteAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updateBy"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updateAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createBy"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phonenumber" character varying NOT NULL`,
    );
  }
}
