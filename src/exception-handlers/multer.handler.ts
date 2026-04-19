import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { MulterError } from "multer";

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter{
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const resp = ctx.getResponse()

    let message = 'File Upload Error'

    switch(exception.code){
     case "LIMIT_FILE_SIZE":
        message = 'File Exceeds 5MB Limit'
        break
      case "LIMIT_FILE_COUNT":
        message = 'You can only upload one file'
        break
    }

    resp.status(HttpStatus.BAD_REQUEST).json({message})
  } 
  
}