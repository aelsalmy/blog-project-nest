import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { Post } from "src/post/post.entity";
import { MailService } from "./mail.service";

@Controller()
export class MailConsumer{

  constructor(private readonly mailService:MailService){}

  @EventPattern('email_notifications')
  handleAdminMail(payload: any){
    this.mailService.sendApprovalNotification(payload.recepient , payload.username , payload.post)
  }
}