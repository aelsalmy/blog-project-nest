import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1775910396894 implements MigrationInterface {
    name = 'CreateUserTables1775910396894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profile" ("id" SERIAL NOT NULL, "profession" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "hashedPassword" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userProfileId" integer, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_2ffc8d3455097079866bfca4d4" UNIQUE ("userProfileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_2ffc8d3455097079866bfca4d47" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_2ffc8d3455097079866bfca4d47"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_profile"`);
    }

}
