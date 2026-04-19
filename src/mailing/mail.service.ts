import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Post } from "src/post/post.entity";

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService){}

  async testEmail(recepient: string){
    await this.mailer.sendMail({
      to: recepient,
      subject: 'TEST MAIL',
      text: 'Hello World! Email has been sent successfully! Testing is Going Well!!'
    })
  }

  async sendWelcomeMail(recepient:string , username: string){
    try{
      await this.mailer.sendMail({
        to: recepient,
        subject: 'Welcome to The Blog Application!',
        template: 'welcome-mail',
        context: {
          username: username
        }
      })
    } catch(err) {
      console.error(`Failed to send Welcome Mail to ${username} at Email ${recepient}`)
    }
  }

    async sendApprovalNotification(recepient:string , username: string , post: Post){
    try{
      await this.mailer.sendMail({
        to: recepient,
        subject: 'Post Approval Notification',
        template: 'approval-notification',
        context: {
          username: username,
          content: post.content
        }
      })
    } catch(err) {
      console.error(`Failed to send Notification Mail to ${username} at Email ${recepient}`)
    }
  }
}