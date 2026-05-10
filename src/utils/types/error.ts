import { $ZodIssue } from "zod/v4/core";

export interface IAppError extends Error{
    statusCode?:number,
    validationError: $ZodIssue[]
}