import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAdminPostApproval1776350169600 implements MigrationInterface {
    name = 'AddedAdminPostApproval1776350169600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "isApproved" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "isApproved"`);
    }

}
