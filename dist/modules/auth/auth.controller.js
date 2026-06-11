"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = require("./auth.service");
const success_response_1 = require("../../utils/types/success.response");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_validation_1 = require("./auth.validation");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const error_handle_1 = require("../../utils/errorHandle/error.handle");
const router = (0, express_1.Router)();
const routes = {
    // base: "/auth",
    signup: "/signUp",
    confirmEmail: "/confirm-email",
    login: "/login",
    profile: "/profile",
    refreshToken: "/refresh-token",
    logout: "/logout"
};
router.post(routes.signup, (0, validation_middleware_1.validation)(auth_validation_1.signUpSchema), async (req, res, next) => {
    const { email, password, gender, age, phone, firstName, lastName } = req.body;
    const { data } = await auth_service_1.authServices.signUp({ email, password, gender, age, phone, firstName, lastName });
    return (0, success_response_1.successRes)({
        res,
        data
    });
});
router.post(routes.login, (0, validation_middleware_1.validation)(auth_validation_1.loginSchema), async (req, res) => {
    const { email, password } = req.body;
    const { data } = await auth_service_1.authServices.login({ email, password });
    (0, success_response_1.successRes)({
        res,
        data,
        message: "login succesfully"
    });
});
router.patch(routes.confirmEmail, (0, validation_middleware_1.validation)(auth_validation_1.confirmEmailSchema), async (req, res) => {
    const { email, otp } = req.body;
    const { data } = await auth_service_1.authServices.confirmEmail({ email, otp });
    return (0, success_response_1.successRes)({
        res,
        data
    });
});
router.post(routes.refreshToken, async (req, res) => {
    const authHeader = req.headers.authorization;
    const refreshToken = authHeader?.split(" ")[1];
    // console.log("Extracted Token:", refreshToken)
    if (!refreshToken) {
        throw new error_handle_1.AppError("there is no refresh token");
    }
    try {
        const { data } = await auth_service_1.authServices.refreshToken(refreshToken);
        return (0, success_response_1.successRes)({ res, data });
    }
    catch (error) {
        throw new error_handle_1.BadRequestExecption("error with decoded");
    }
});
router.patch(routes.logout, auth_middleware_1.auth, (0, validation_middleware_1.validation)(auth_validation_1.logoutSchema), async (req, res) => {
    const { flag } = req.body;
    const { data } = await auth_service_1.authServices.logoutService({
        user: req.user,
        iat: req.decoded.iat,
        jti: req.decoded.jti,
        flag
    });
    (0, success_response_1.successRes)({ res, data });
});
exports.default = router;
