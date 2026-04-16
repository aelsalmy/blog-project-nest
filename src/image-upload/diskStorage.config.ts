import multer from "multer";
import { extname, join } from "path";
import type { AuthRequest } from "src/auth/auth.guard";
import * as fs from 'fs';
import { randomUUID } from "crypto";

export function customDiskStorage(){
  return multer.diskStorage({
    destination: (req , file , cb) => {
      const userId = (req as AuthRequest).userId
      
      const dir = join('./uploads/' , `userId_${userId}`)

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null , dir)
    },
    filename: (req , file , cb) => {
      const uuid = randomUUID() + '-' + extname(file.originalname)
      cb(null , uuid)
    }

  })
}