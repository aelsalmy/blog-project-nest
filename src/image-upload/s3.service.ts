import { Injectable } from "@nestjs/common";
import { s3 } from "./s3.config";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service{

  async uploadFile(file: Express.Multer.File , key: string){    
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    )
  }

  async getSignedUrl(key:string){
    const command = new GetObjectCommand({
      Key: key,
      Bucket: process.env.AWS_BUCKET_NAME
    })

    const url = await getSignedUrl(s3, command, {
      expiresIn: 3600, 
    });

    return { url }
  }

  async deleteFile(key: string) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      }),
    );

    return { deleted: true };
  }
}