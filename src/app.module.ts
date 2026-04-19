import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule , ConfigService } from '@nestjs/config'
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PostModule,
    ConfigModule.forRoot({isGlobal: true}),
    MailerModule.forRoot({
        transport:{
          host: process.env.SMTP_DEV_HOST,
          port: process.env.SMTP_DEV_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_DEV_USERNAME,
            pass: process.env.SMTP_DEV_PASSWORD
          },
        } ,
        defaults: {
          from: '"Blog App" <no-reply@blogApp.com'   ,
        },
        template: {
          dir: join(__dirname , './mailing/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),

        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],

        synchronize: false, 
        migrationsRun: false, 
      })
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
