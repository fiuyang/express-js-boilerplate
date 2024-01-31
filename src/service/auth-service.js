import {validate} from "../validation/validation.js";
import {
    checkOtpUserValidation,
    forgotPasswordUserValidation,
    loginUserValidation,
    registerUserValidation,
    resetPasswordUserValidation,
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v4 as uuid} from "uuid";
import generateOtp from "../utils/generate.js";
import sendEmail from "../utils/sendEmail.js";


const blacklist = [];
const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    user.id = uuid();
    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true,
            email: true,
        }
    });
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email
        },
        select: {
            email: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Email or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Email or password wrong");
    }

    const accessToken  = jwt.sign({email: user.email}, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_SECRET
    });

    return accessToken;
}

const logout = async (req) => {
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    blacklist.push(decodedToken.jti);
}

const forgotPassword = async (request) => {
    const forgotPasswordRequest = validate(forgotPasswordUserValidation, request);

    let checkEmail = await prismaClient.passwordResets.findUnique({
        where: {
            email: forgotPasswordRequest.email
        },
        select: {
            email: true,
            otp: true,
            createdAt: true,
        }
    });

    if (!checkEmail) {
        const user = {
            email: forgotPasswordRequest.email,
            otp: await generateOtp(),
            createdAt: new Date()
        };

        checkEmail = await prismaClient.passwordResets.create({
            data: user,
            select: {
                email: true,
                otp: true,
                createdAt: true,
            }
        });
    } else {
        checkEmail = await prismaClient.passwordResets.update({
            where: {
                email: forgotPasswordRequest.email
            },
            data: {
                otp: await generateOtp(),
                createdAt: new Date()
            },
            select: {
                email: true,
                otp: true,
                createdAt: true,
            }
        });
    }
    
    await sendEmail(checkEmail.email, 'Forgot Password', checkEmail.otp);

    return checkEmail;
}

const checkOtp =  async (request) => {
    const checkOtpRequest = validate(checkOtpUserValidation, request);

    const checkOtp = await prismaClient.passwordResets.findUnique({
        where: {
            otp: checkOtpRequest.otp
        },
        select: {
            email: true,
            otp: true,
            createdAt: true,
        }
    });

    if (!checkOtp) {
        throw new ResponseError(404, "Otp not found");
    }

    const currentTime = new Date();

    const timeDifference = currentTime.getTime() - checkOtp.createdAt.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Menghitung selisih waktu dalam menit

    if (minutesDifference > 5) {
      throw new NotFoundException('OTP expired');
    }

    return checkOtp;
}

const resetPassword =  async (request, otp) => {
    const resetPasswordRequest = validate(resetPasswordUserValidation, request);
    const otpInteger = parseInt(otp);
    try {
        await prismaClient.$transaction(async (prisma) => {
            const checkOtp = await prisma.passwordResets.findUnique({
                where: {
                    otp: otpInteger
                },
                select: {
                    email: true,
                    otp: true,
                    createdAt: true,
                }
            });

            console.log(checkOtp);

            if (!checkOtp) {
                throw new ResponseError(404, "Otp not found");
            }

            const currentTime = new Date();
            const timeDifference = currentTime.getTime() - checkOtp.createdAt.getTime();
            const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Menghitung selisih waktu dalam menit

            if (minutesDifference > 5) {
                throw new ResponseError(401, 'OTP expired');
            }

            const updatedPassword = await bcrypt.hash(resetPasswordRequest.password, 10);

            await prisma.user.update({
                where: {
                    email: checkOtp.email
                },
                data: {
                    password: updatedPassword
                }
            });

            await prisma.passwordResets.deleteMany({
                where: {
                    email: checkOtp.email,
                },
            });
        });
    } catch (error) {
        throw new ResponseError(500, error);
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
