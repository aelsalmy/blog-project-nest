import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPublishFlag1776091849137 implements MigrationInterface {
    name = 'AddedPublishFlag1776091849137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "isPublished" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "content" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "content" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "isPublished"`);
    }

}
