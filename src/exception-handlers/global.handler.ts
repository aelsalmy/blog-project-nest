import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter{
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const resp = ctx.getResponse()

    if(exception.message === "UNEXPECTED_EXTENSION"){
      return resp.status(HttpStatus.BAD_REQUEST).json({message: "File Uploaded should be an image"})
    }


    return resp.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .json({message: exception.message})
  }
  
}