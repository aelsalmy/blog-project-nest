import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './exception-handlers/global.handler';
import { MulterExceptionFilter } from './exception-handlers/multer.handler';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options:{
      urls: [`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@rabbitmq:5672`],
      queue: 'email_notifications',
      queueOptions: {durable: true}
    }
  })

  app.use(cookieParser())

  app.use(morgan('dev'))

  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalFilters(new MulterExceptionFilter())

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@rabbitmq:5672`],
      queue: 'email_notifications',
    }
  })

  const options = new DocumentBuilder()
    .setTitle('Blog App')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices()

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
