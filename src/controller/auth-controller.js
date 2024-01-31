import authService from "../service/auth-service.js";

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({
            message : "Registrasion Successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({
            message : "Login Successfully",
            data: { token: result }
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await authService.logout(req);
        res.status(200).json({
            message : "Logout Successfully",
            data: []
        });
    } catch (e) {
        next(e);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(req.body);
       
        res.status(200).json({
            message : "Forgot Password Successfully",
            data: { otp: result.otp }
        });
    } catch (e) {
        next(e);
    }
}

const checkOtp = async (req, res, next) => {
    try {
        const result = await authService.checkOtp(req.body);
        res.status(200).json({
            message : "Otp Valid",
            data: { otp: result.otp }
        });
    } catch (e) {
        next(e);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const otp = req.query.otp;
        console.log(otp);
        await authService.resetPassword(req.body, otp);
        res.status(200).json({
            message : "Reset Password Successfully",
            data: []
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    logout,
    forgotPassword,
    checkOtp,
    resetPassword
}
