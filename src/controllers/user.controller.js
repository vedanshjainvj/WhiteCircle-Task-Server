// --------------- Importing Other Files --------------- //
import APIError from '../utilities/apiError.js';
import userToken from '../middlewares/userToken.js';
import otpService from '../services/otp.service.js';
import userService from '../services/user.service.js';
import ResponseHandler from '../utilities/apiResponse.js';
import statusCodeUtility from '../utilities/statusCodeUtility.js'


const moduleType = "User";
const messages = {
    auth: {
        Success: "User authenticated successfully",
        Unauthorized: "Unauthorized access",
        NotFound: "User not found",
        AlreadyExists: "User already exists",
        InternalServerError: "Internal server error",
        DeletionMessage: "User deleted successfully"
    },
    createdSuccess: `${moduleType} created Successfully `,
    notFound: `${moduleType} not found`,
    fetchMessages: [`${moduleType} fetched successfully`, `Something went wrong in fetching ${moduleType}`],
    alreadyExist: `${moduleType} already exists`,
    internalServerError: "Internal Server Error",
    dataNotProvided: `${moduleType} data not provided`,
    otp: {
        Sent: "OTP sent successfully",
        Invalid: "Invalid or expired OTP",
        Verified: "OTP verified successfully",
        error: "Error in OTP verification"
    },
    user: {
        LoginSuccess: "User logged in successfully",
        NotVerified: "User not verified. OTP sent to email",
        SummaryRetrieved: "User summary retrieved successfully",
        MonthlySummaryRetrieved: "User monthly summary retrieved successfully",
        summaryError: "User summary not found",
        monthlySummaryError: "User monthly summary not found",
    }
}


class UserController {

    // ------------------ Verify Token ------------------ //
    async verifyToken(request, response, next) {
        const user = request.user;
        if (!user) {
            return next(new APIError(statusCodeUtility.Unauthorized, messages.auth.NotFound));
        }
        return ResponseHandler(
            statusCodeUtility.Success,
            messages.fetchMessages[0],
            {
                userData: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role || "user",
                }
            },
            response
        );
    }

    // ------------------ User Registration ------------------ //
    async registerUser(request, response, next) {
        const { fullName, email, password } = request.body;
        if (!fullName || !email || !password) {
            return next(new APIError(statusCodeUtility.BadRequest, messages.dataNotProvided));
        }
        const userData = await userService.registerUserService({ fullName, email, password });
        const otp = await otpService.Generateotp({ email });
        if (otp !== "OTP sent successfully") {
            return next(new APIError(statusCodeUtility.InternalServerError, otp,));
        }
        return ResponseHandler(
            statusCodeUtility.Success,
            messages.createdSuccess,
            userData,
            response
        );
    }

    // ------------------ Verify OTP ------------------ //
    async verifyOtp(request, response, next) {
        const { email, otp } = request.body;
        if (!email || !otp) {
            return next(new APIError(statusCodeUtility.BadRequest, messages.dataNotProvided));
        }
        else {
            const user = await otpService.verifyOtp({ email, otp });
            if (!user) {
                return next(new APIError(statusCodeUtility.BadRequest, messages.otp.Invalid));
            }
            return ResponseHandler(
                statusCodeUtility.Success,
                messages.otp.Verified,
                user,
                response
            );
        }
    }

    // ------------------ User Login ------------------ //
    async loginUser(request, response, next) {
        const { email, password, role } = request.body;

        if (!email || !password) {
            return next(new APIError(statusCodeUtility.BadRequest, messages.dataNotProvided));
        }

        else {
            const user = await userService.loginUserService({ email, password, role });
            if (!user) {
                return next(new APIError(statusCodeUtility.BadRequest, messages.auth.NotFound));
            }
            if (user.isVerified === false) {
                const otp = await otpService.Generateotp({ email });
                return ResponseHandler(
                    statusCodeUtility.Unauthorized,
                    messages.user.NotVerified,
                    { email: user.email, otp },
                    response
                );
            }
            else {
                const token = await userToken.generateToken(user);
                response.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "None",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });

                return ResponseHandler(
                    statusCodeUtility.Success,
                    messages.user.LoginSuccess,
                    {
                        token: "Token set in HTTP-only cookie",
                        userData: user
                    },
                    response
                );
            }
        }
    }


    // ------------------ Get User Summary ------------------ //
    async getUserSummary(request, response, next) {
        const userId = request.user.id;
        if (!userId) {
            return next(new APIError(statusCodeUtility.BadRequest, messages.auth.Unauthorized));
        }

        else {
            const userSummary = await userService.getUserSummaryService(userId);

            if (!userSummary) {
                return next(new APIError(statusCodeUtility.NotFound, messages.user.summaryError));
            }
            return ResponseHandler(
                statusCodeUtility.Success,
                messages.user.SummaryRetrieved,
                userSummary,
                response
            );
        }
    }

    // ------------------ Get User Monthly Summary ------------------ //
    async getUserMonthlySummary(request, response, next) {
        const userId = request.user.id;
        if (!userId) {
            return next(new APIError(statusCodeUtility.BadRequest, messages.auth.Unauthorized));
        }

        else {
            const userMonthlySummary = await userService.getUserStatsService(userId);
            const userSummary = await userService.getUserSummaryService(userId);

            if (!userMonthlySummary) {
                return next(new APIError(statusCodeUtility.NotFound, messages.user.monthlySummaryError));
            }
            return ResponseHandler(
                statusCodeUtility.Success,
                messages.user.MonthlySummaryRetrieved,
                {
                    userMonthlySummary,
                    userSummary
                },
                response
            );
        }
    }

}

export default new UserController();
