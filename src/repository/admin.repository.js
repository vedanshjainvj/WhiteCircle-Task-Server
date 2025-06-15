// --------------- Importing Other Files --------------- //
import User from "../models/user.model.js";
import Resource from "../models/resource.model.js";
import Notification from "../models/notifications.model.js";


class AdminRepository {

    // ------------------ Admin Login ------------------ //
    async findAdminByEmail({ email, role = "admin" }) {
        return await User.findOne({ email, role });
    }

    async getUsers() {
        return await User.find(
            { role: { $ne: "admin" } },
            { password: 0 }
        );
    }

    async getResources() {
        return await Resource.find();
    }

    async getResourcesWithPagination(skip, limit) {
        return await Resource.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async countResources() {
        return await Resource.countDocuments();
    }

    async getUsersWithPagination(skip, limit) {
        return await User.find(
            { role: { $ne: "admin" } },
            { password: 0 }
        )
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async getAllUsersSummary() {
        return await User.aggregate([
            {
                $match: {
                    role: { $ne: "admin" }
                }
            },
            {
                $lookup: {
                    from: "resources",
                    localField: "_id",
                    foreignField: "userId",
                    as: "resources"
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    allResources: { $push: "$resources" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalUsers: 1,
                    flattenedResources: {
                        $reduce: {
                            input: "$allResources",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] }
                        }
                    }
                }
            },
            {
                $project: {
                    totalUsers: 1,
                    totalResources: { $size: "$flattenedResources" },
                    totalImages: {
                        $size: {
                            $filter: {
                                input: "$flattenedResources",
                                as: "resource",
                                cond: { $eq: ["$$resource.metaData.fileType", "img"] }
                            }
                        }
                    },
                    totalDocs: {
                        $size: {
                            $filter: {
                                input: "$flattenedResources",
                                as: "resource",
                                cond: { $ne: ["$$resource.metaData.fileType", "img"] }
                            }
                        }
                    }
                }
            }
        ]);
    }

    async getAllUserMonthlyStats() {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const monthlyStats = await User.aggregate([
            { $match: { role: "user" } },
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
            const monthName = monthNames[monthIndex];

            const existing = formattedStats.find(stat => stat.month === monthName);

            if (existing) {
                result.push(existing);
            } else {
                result.push({
                    month: monthName,
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

    async pushNotification(resourceId) {
        return await Notification.create({ resourceId });
    }

}

export default new AdminRepository();
