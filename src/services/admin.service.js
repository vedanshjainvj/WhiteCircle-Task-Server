// -------------------- PACKAGE IMPORT FILES -------------------- //
import bcrypt from "bcryptjs";

// --------------- Importing Other Files --------------- //
import APIError from '../utilities/apiError.js';
import userRepository from "../repository/user.repository.js";
import adminRepository from "../repository/admin.repository.js";
import statusCodeUtility from "../utilities/statusCodeUtility.js";
import { getPagination } from "../utilities/paginationUtility.js";
import { sendResourceExpiryReminder } from "../utilities/sendMail.js";
import resourceRepository from "../repository/resource.repository.js";

class AdminService {

    // ------------------ Admin Login ------------------ //
    async adminLoginService({ email, password, role }) {

        if (!email || !password) {
            throw new APIError("Email and password are required", statusCodeUtility.BadRequest);
        }

        const admin = await adminRepository.findAdminByEmail({ email, role });
        if (!admin) {
            throw new APIError("Invalid email or password", statusCodeUtility.Unauthorized);
        }
        if (admin.role === "user") {
            throw new APIError("Unauthorized access", statusCodeUtility.Unauthorized);
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new APIError("Invalid password", statusCodeUtility.Unauthorized);
        }
        return {
            id: admin._id,
            name: admin.fullName,
            email: admin.email,
            role: admin.role,
        };
    }

    async getUsers({ pageNo, limit }) {
        const totalItems = await userRepository.countUsers();
        const { skip, page, totalPages } = getPagination({ pageNo, limit }, totalItems);
        const users = await adminRepository.getUsersWithPagination(skip, limit);
        if (!users) {
            throw new APIError("No users found", statusCodeUtility.NotFound);
        }
        return {
            users,
            pagination: {
                page,
                limit,
                totalPages,
                totalItems
            }
        };
    }

    async getResourcesWithPagination({ pageNo, limit }) {
        const totalItems = await adminRepository.countResources();
        const { skip, page, totalPages } = getPagination({ pageNo, limit }, totalItems);
        const resources = await adminRepository.getResourcesWithPagination(skip, limit);
        if (!resources) {
            throw new APIError("No resources found", statusCodeUtility.NotFound);
        }
        return {
            resources,
            pagination: {
                page,
                limit,
                totalPages,
                totalItems
            }
        };
    }

    async getAllUsersSummary() {
        const userSummary = await adminRepository.getAllUsersSummary();
        if (!userSummary) {
            throw new APIError("No user summary found", statusCodeUtility.NotFound);
        }
        return userSummary
    }

    async getAllUsersMonthlySummary() {
        const userMonthlySummary = await adminRepository.getAllUserMonthlyStats();
        if (!userMonthlySummary) {
            throw new APIError("No user monthly summary found", statusCodeUtility.NotFound);
        }
        return userMonthlySummary;
    }

    async sendMailManual() {
        const users = await resourceRepository.getAllUsersWithExpiringResources();

        const results = await Promise.all(users.map(async (user) => {
            try {
                const responseEmail = await sendResourceExpiryReminder(user);

                if (responseEmail.message === "Mail sent successfully") {
                    await adminRepository.pushNotification(responseEmail.resourceId);
                    console.log(`✅ Email sent to ${user.userEmail}`);
                    return 1;
                } else {
                    console.log(`❌ Failed to send email to ${user.userEmail}`);
                    return 0;
                }

            } catch (err) {
                console.error(`🔥 Error for ${user.userEmail}:`, err);
                return 0;
            }
        }));

        const emailsSent = results.reduce((sum, count) => sum + count, 0);
        return { message: `${emailsSent} emails sent successfully` };
    }

}


export default new AdminService();
