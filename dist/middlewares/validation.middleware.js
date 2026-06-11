"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const error_handle_1 = require("./../utils/errorHandle/error.handle");
const validation = (schema) => {
    return (req, res, next) => {
        const keys = Object.keys(schema);
        const validationErrors = [];
        if (req.files) {
            req.body.files = req.files;
        }
        if (req.file) {
            req.body.file = req.file;
        }
        //iterate  if it body or query or param
        keys.map(key => {
            if (schema[key]) {
                const validationRes = schema[key].safeParse(req[key]);
                if (!validationRes.success) {
                    validationErrors.push(...validationRes.error.issues); //return the errors to the array
                }
            }
        });
        if (validationErrors.length) {
            throw new error_handle_1.ValidationExecption(validationErrors); //print the array of errors
        }
        return next();
    };
};
exports.validation = validation;
