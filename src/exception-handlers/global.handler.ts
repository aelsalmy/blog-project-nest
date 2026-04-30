import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter{
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const resp = ctx.getResponse()

    let status = 500

    if(exception.message === "UNEXPECTED_EXTENSION"){
      return resp.status(HttpStatus.BAD_REQUEST).json({message: "File Uploaded should be an image"})
    }

    if(exception instanceof HttpException){
      status = exception.getStatus()
      const response = exception.getResponse()
      return resp.status(status).json(
        typeof response === 'string' ? { message: response } : response
      )
    }

    return resp.status(status)
               .json({message: exception.message})
  }
  
}