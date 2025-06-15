// -------------------- PACKAGE IMPORT FILES -------------------- //
import bcrypt from "bcryptjs";

// --------------- Importing Other Files --------------- //
import APIError from '../utilities/apiError.js';
import userRepository from "../repository/user.repository.js";
import statusCodeUtility from "../utilities/statusCodeUtility.js";

class UserService {

    // ------------------ User Registration ------------------ //
    async registerUserService({ fullName, email, password }) {

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new APIError(statusCodeUtility.Conflict, "User already exists with this email");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userRepository.createUserRepository({
            name: fullName,
            email,
            password: hashedPassword,
        });

        if (!newUser) {
            throw new APIError(statusCodeUtility.InternalServerError, "Error in creating user");
        }

        return {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        };
    }

    // ------------------ User Login ------------------ //
    async loginUserService({ email, password, role }) {

        const user = await userRepository.findByEmail({ email, role });

        if (!user) {
            throw new APIError(statusCodeUtility.NotFound, "Invalid email or role");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new APIError(statusCodeUtility.BadRequest, "Invalid password");
        }

        return {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role || "user",
            isVerified: user.isVerified || false,
        };
    }

    // ------------------ User Profile ------------------ //
    async getUserProfileService(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new APIError(statusCodeUtility.NotFound, "User Profile not found");
        }

        return {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role || "user",
            isVerified: user.isVerified || false,
        };
    }

    // ------------------ Get User Summary ------------------ //
    async getUserSummaryService(userId) {
        const userSummary = await userRepository.getUserSummary(userId);
        if (!userSummary) {
            throw new APIError(statusCodeUtility.NotFound, "User Summary not found");
        }

        return {
            userId: userId,
            ...userSummary
        }
    }

    // ------------------ Get stats ------------------ //
    async getUserStatsService(userId) {
        const userStats = await userRepository.getUserMonthlyStats(userId);
        if (!userStats) {
            throw new APIError(statusCodeUtility.NotFound, "User Monthly Stats not found");
        }
        return {
            userId: userId,
            ...userStats
        }
    }

}

export default new UserService();