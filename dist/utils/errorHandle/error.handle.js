"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unAuthorizedExecption = exports.ValidationExecption = exports.ConflictExecption = exports.BadRequestExecption = exports.NotFoundExecption = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    validationError;
    constructor(message, statusCode, validationError, options) {
        super(message, options);
        this.statusCode = statusCode;
        this.validationError = validationError;
    }
}
exports.AppError = AppError;
class NotFoundExecption extends AppError {
    constructor(message) {
        super(message || "page not found", 404);
    }
}
exports.NotFoundExecption = NotFoundExecption;
class BadRequestExecption extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestExecption = BadRequestExecption;
class ConflictExecption extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictExecption = ConflictExecption;
class ValidationExecption extends AppError {
    constructor(errors) {
        super("validation error", 423, errors);
    }
}
exports.ValidationExecption = ValidationExecption;
class unAuthorizedExecption extends AppError {
    constructor(message = "unAuthorized") {
        super(message, 401);
    }
}
exports.unAuthorizedExecption = unAuthorizedExecption;
