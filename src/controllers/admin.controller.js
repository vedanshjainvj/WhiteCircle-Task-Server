// --------------- Importing Other Files --------------- //
import { envProvider } from '../constants.js';
import APIError from '../utilities/apiError.js';
import userToken from '../middlewares/userToken.js';
import adminService from '../services/admin.service.js';
import ResponseHandler from '../utilities/apiResponse.js';
import statusCodeUtility from '../utilities/statusCodeUtility.js'

const messages = {
    auth: {
        InvalidCredentials: "Invalid email or password",
        authorizedAccess: "Authorized successfully",
    },
    fetchMessages: ["Data fetched successfully", " Mail sent successfully"],
    errorMessages: {
        UnauthorizedAccess: "Unauthorized access",
    }
}

class AdminController {

    // ------------------ Admin Login ------------------ //
    async adminLogin(request, response, next) {
        const { email, password, role } = request.body;
        const admin = await adminService.adminLoginService({ email, password, role });
        if (!admin) {
            return next(new APIError(messages.auth.InvalidCredentials, statusCodeUtility.Unauthorized));
        }
        const token = await userToken.generateToken(admin);
        response.cookie("authToken", token, {
            httpOnly: true,
            secure: envProvider.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return ResponseHandler(
            statusCodeUtility.Success,
            messages.auth.authorizedAccess,
            {
                token: "Token set in HTTP-only cookie",
                userData: admin
            },
            response
        );
    }

    async getUsers(request, response, next) {
        const { role } = request.user;
        if (role !== "admin") {
            return next(new APIError(messages.errorMessages.UnauthorizedAccess, statusCodeUtility.Forbidden));
        } else {
            const users = await adminService.getUsers(request.query);
            return ResponseHandler(
                statusCodeUtility.Success,
                messages.fetchMessages[0],
                users,
                response
            );
        }

    }

    async getResources(request, response, next) {
        const { role } = request.user;
        if (role !== "admin") {
            return next(new APIError(messages.errorMessages.UnauthorizedAccess, statusCodeUtility.Forbidden));
        }
        const resources = await adminService.getResourcesWithPagination(request.query);

        return ResponseHandler(
            statusCodeUtility.Success,
            messages.fetchMessages[0],
            resources,
            response
        );

    }

    async getAllUsersSummary(request, response, next) {
        const { role } = request.user;
        if (role !== "admin") {
            return next(new APIError(messages.errorMessages.UnauthorizedAccess, statusCodeUtility.Forbidden));
        }
        const userSummary = await adminService.getAllUsersSummary();
        return ResponseHandler(
            statusCodeUtility.Success,
            messages.fetchMessages[0],
            userSummary,
            response
        );
    }

    async getAllUsersMonthlySummary(request, response, next) {
        const { role } = request.user;
        if (role !== "admin") {
            return next(new APIError(messages.errorMessages.UnauthorizedAccess, statusCodeUtility.Forbidden));
        }
        const userMonthlySummary = await adminService.getAllUsersMonthlySummary();
        const getAllUsersSummary = await adminService.getAllUsersSummary();
        if (!userMonthlySummary || !getAllUsersSummary) {
            return next(new APIError("No user monthly summary found", statusCodeUtility.NotFound));
        }
        return ResponseHandler(
            statusCodeUtility.Success,
            messages.fetchMessages[0],
            {
                userMonthlySummary,
                getAllUsersSummary
            },
            response
        );
    }

    async sendMailManual(request, response, next) {
        const { role } = request.user;
        if (role !== "admin") {
            return next(new APIError(messages.errorMessages.UnauthorizedAccess, statusCodeUtility.Forbidden));
        }
        const sentMailToAllUsers = await adminService.sendMailManual();
        if (!sentMailToAllUsers) {
            return next(new APIError("Failed to send mail to all users", statusCodeUtility.InternalServerError));
        }
        return ResponseHandler(
            statusCodeUtility.Success,
            messages.fetchMessages[1],
            sentMailToAllUsers,
            response
        );
    }

}

export default new AdminController();
