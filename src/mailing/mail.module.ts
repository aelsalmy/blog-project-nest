import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailConsumer } from "./mail.consumer";
import { RabbitMQModule } from "src/config/rabbitmq.module";

@Module({
  imports: [RabbitMQModule],
  providers: [MailService],
  controllers: [MailConsumer],
  exports: [MailService]
})
export class MailModule {}