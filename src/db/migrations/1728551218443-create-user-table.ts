import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1728551218443 implements MigrationInterface {
  name = 'CreateUserTable1728551218443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userName" character varying(150) NOT NULL, "password" text NOT NULL, "email" character varying(256) NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "phoneNumber" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'staff', "createdById" integer, "updatedById" integer, "deletedById" integer, CONSTRAINT "UQ_7b71590b41481d02c4fb4dbed13" UNIQUE ("userName", "email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_51d635f1d983d505fb5a2f44c52" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_52e97c477859f8019f3705abd21" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_e9d50c91bd84f566ce0ac1acf44" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_e9d50c91bd84f566ce0ac1acf44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_52e97c477859f8019f3705abd21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_51d635f1d983d505fb5a2f44c52"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
