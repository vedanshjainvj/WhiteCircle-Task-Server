// -------------------- PACKAGE IMPORT FILES -------------------- //
import mongoose from "mongoose";

// --------------- Importing Other Files --------------- //
import User from "../models/user.model.js";

class userRepository {


    // ------------------ Count users ------------------ //
    async countUsers() {
       return await User.countDocuments({ role: "user" });
    }

    // ------------------ User Registration ------------------ //
    async createUserRepository({ name, email, password }) {
        const newUser = new User({
            fullName: name,
            email,
            password,
        });

        return await newUser.save();
    }

    // ------------------ Find User By Email ------------------ //
    async findByEmail({ email, role = "user" }) {
        return await User.findOne({ email, role });
    }

    // ------------------ Update User ------------------ //
    async updateUser(filter, update, options = { new: true }) {
        const updatedUser = await User.findOneAndUpdate(
            filter,
            update,
            options
        );
        return updatedUser;
    }

    // ------------------ Find User By ID ------------------ //
    async findById(userId) {
        return await User.findById(userId,{password:0});
    }

    async getUserSummary(userId) {

        const objectId = mongoose.Types.ObjectId.isValid(userId)
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const summary = await User.aggregate([
            { $match: { _id: objectId, role: "user" } },
            {
                $lookup: {
                    from: "resources",
                    localField: "_id",
                    foreignField: "userId",
                    as: "resources"
                }
            },
            {
                $project: {
                    totalUploads: { $size: "$resources" },
                    images: { $size: { $filter: { input: "$resources", as: "resource", cond: { $eq: ["$$resource.metaData.fileType", "img"] } } } },
                    docs: { $size: { $filter: { input: "$resources", as: "resource", cond: { $eq: ["$$resource.metaData.fileType", "doc"] } } } },
                    docx: { $size: { $filter: { input: "$resources", as: "resource", cond: { $eq: ["$$resource.metaData.fileType", "docx"] } } } },
                    pdf: { $size: { $filter: { input: "$resources", as: "resource", cond: { $eq: ["$$resource.metaData.fileType", "pdf"] } } } },
                    expiringIn7Days: {
                        $size: {
                            $filter: {
                                input: "$resources",
                                as: "resource",
                                cond: { 
                                    $and: [
                                        { $ne: ["$$resource.metaData.expiryDate", null] },
                                        { $gte: ["$$resource.metaData.expiryDate", new Date()] },
                                        { $lt: ["$$resource.metaData.expiryDate", new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)] }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        return summary[0] || { totalUploads: 0, images: 0, docs: 0, docx: 0, pdf: 0, expiringIn7Days: 0 };
    }


    // ------------------ Get stats ------------------ //
    async getUserMonthlyStats(userId) {
        console.log("Fetching monthly stats for user ID:", userId);

        const objectId = mongoose.Types.ObjectId.isValid(userId)
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const monthlyStats = await User.aggregate([
            { $match: { _id: objectId, role: "user" } },
            {
                $lookup: {
                    from: "resources",
                    localField: "_id",
                    foreignField: "userId",
                    as: "resources"
                }
            },
            { $unwind: "$resources" },
            {
                $match: {
                    "resources.createdAt": { $gte: sixMonthsAgo }
                }
            },
            {
                $project: {
                    month: { $month: "$resources.createdAt" },
                    year: { $year: "$resources.createdAt" },
                    fileType: "$resources.metaData.fileType"
                }
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year" },
                    images: {
                        $sum: { $cond: [{ $eq: ["$fileType", "img"] }, 1, 0] }
                    },
                    docs: {
                        $sum: { $cond: [{ $eq: ["$fileType", "doc"] }, 1, 0] }
                    },
                    docx: {
                        $sum: { $cond: [{ $eq: ["$fileType", "docx"] }, 1, 0] }
                    },
                    pdf: {
                        $sum: { $cond: [{ $eq: ["$fileType", "pdf"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    year: "$_id.year",
                    images: 1,
                    docs: 1,
                    docx: 1,
                    pdf: 1,
                    total: { $sum: ["$images", "$docs", "$docx", "$pdf"] }
                }
            },
            { $sort: { year: 1, month: 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const formattedStats = monthlyStats.map(stat => ({
            month: monthNames[stat.month - 1],
            images: stat.images,
            docs: stat.docs,
            docx: stat.docx,
            pdf: stat.pdf,
            total: stat.total
        }));

        const result = [];
        const currentMonth = now.getMonth();

        for (let i = 0; i < 6; i++) {
            const monthIndex = (currentMonth - 5 + i + 12) % 12;
            const existingStat = formattedStats.find(s => s.month === monthNames[monthIndex]);

            if (existingStat) {
                result.push(existingStat);
            } else {
                result.push({
                    month: monthNames[monthIndex],
                    images: 0,
                    docs: 0,
                    docx: 0,
                    pdf: 0,
                    total: 0
                });
            }
        }

        return result;
    }
}

export default new userRepository();
