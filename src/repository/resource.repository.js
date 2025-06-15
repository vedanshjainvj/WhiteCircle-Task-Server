// -------------------- PACKAGE IMPORT FILES -------------------- //
import mongoose from "mongoose";

// --------------- Importing Other Files --------------- //
import Resource from "../models/resource.model.js";
import Notification from "../models/notifications.model.js";

class ResourceRepository {

    async createResource(data) {
        const resource = new Resource(data);
        return await resource.save();
    }

    async updateResource(id, data) {
        return await Resource.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteResource(id) {
        return await Resource.findByIdAndDelete(id);
    }

    async getResources(query) {
        return await Resource.find(query)
            // .populate('userId', 'name email')
            .sort({ createdAt: -1 });
    }

    async getResourceById(id) {
        return await Resource.findOne({ _id: id })
        // .populate('userId', 'name email');
    }

    async getResourcesByUserId(userId) {
        return await Resource.find({ userId })
            // .populate('userId', 'name email')
            .sort({ createdAt: -1 });
    }

    async countResourcesByUserId(userId) {
        return await Resource.countDocuments({ userId });
    }

    async getResourcesWithPagination(userId, skip, limit) {
        return await Resource.find({ userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async getResourcesByUserIdWithPagination(userId, skip, limit) {
        return await Resource.find({ userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async getAllUsersWithExpiringResources() {
        const now = new Date();
        const next24Hours = new Date(now);
        next24Hours.setHours(now.getHours() + 24);

        const sentList = await Notification.find({});
        const notifiedResourceIds = sentList
            .map(n => n.resourceId?.toString())
            .filter(id => id !== null);

        const notifiedObjectIds = notifiedResourceIds.map(id => new mongoose.Types.ObjectId(id));

        return await Resource.aggregate([
            {
                $match: {
                    "metaData.expiryDate": {
                        $exists: true,
                        $ne: null,
                        $gte: now,
                        $lte: next24Hours
                    },
                    _id: { $nin: notifiedObjectIds }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    title: 1,
                    userName: "$userDetails.fullName",
                    userEmail: "$userDetails.email",
                    expiryDate: "$metaData.expiryDate",
                    resourceUrl: 1,
                    resourceId: "$_id"
                }
            }
        ]);
    }
}

export default new ResourceRepository();
