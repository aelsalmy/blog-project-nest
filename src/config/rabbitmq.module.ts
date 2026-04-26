import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options:{
          urls: [`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@rabbitmq:5672`],
          queue: 'email_notifications',
          queueOptions: {durable: true}
        }
      }
    ]),
  ],
    exports: [ClientsModule]
})
export class RabbitMQModule{}