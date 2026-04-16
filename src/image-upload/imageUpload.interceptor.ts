import { BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { customDiskStorage } from "./diskStorage.config";

export function imageUploadInterceptor(){
  return FileInterceptor('file' , {
    fileFilter: (req , file , callback) => {
      const allowed = /jpeg|jpg|png|webp/

      const isValidExt = allowed.test(file.originalname.toLowerCase())
      const isValidMime = allowed.test(file.mimetype)

      if(isValidExt && isValidMime){
        return callback(null , true)
      }

      callback(new Error('UNEXPECTED_EXTENSION') , false)
    },
    storage: customDiskStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,  
      files: 1,
    }
  })
}