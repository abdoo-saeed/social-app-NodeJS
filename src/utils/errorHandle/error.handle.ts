import { $ZodIssue } from 'zod/v4/core';




export class AppError extends Error{
    constructor(
        message:string,
        public statusCode?:number,
        public validationError?:$ZodIssue[],
        options?:ErrorOptions
    ){
        super(message,options)
    }
}




export class NotFoundExecption extends AppError{
    constructor(
        message?:string
    ){
       super(message || "page not found",404)
    }
}


export class BadRequestExecption extends AppError{
    constructor(
        message:string
    ){
       super(message,400)
    }
}


export class ConflictExecption extends AppError{
    constructor(
        message:string
    ){
       super(message,409)
    }
}


export class ValidationExecption extends AppError{
    constructor(
        errors: Array<$ZodIssue>
    ){
       super("validation error",423,errors)
    }
    
}
export class unAuthorizedExecption extends AppError{
    constructor(
        message = "unAuthorized"
    ){
       super(message,401)
    }
    
}