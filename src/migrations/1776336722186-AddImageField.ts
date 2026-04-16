import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageField1776336722186 implements MigrationInterface {
    name = 'AddImageField1776336722186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "image"`);
    }

}
