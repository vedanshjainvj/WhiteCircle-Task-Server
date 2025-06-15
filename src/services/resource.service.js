// --------------- Importing Other Files --------------- //
import APIError from '../utilities/apiError.js';
import userRepository from "../repository/user.repository.js";
import statusCodeUtility from "../utilities/statusCodeUtility.js";
import { getPagination } from "../utilities/paginationUtility.js";
import resourceRepository from "../repository/resource.repository.js";


class ResourceService {

    async getResourceWithPagination(id, query) {
        const totalItems = await resourceRepository.countResourcesByUserId(id);

        const { skip, page, totalPages } = getPagination(query, totalItems);
        const resources = await resourceRepository.getResourcesWithPagination(id, skip, query.limit);
        if (!resources) {
            throw new APIError(statusCodeUtility.NotFound, "No resources found for this user");
        }
        return {
            resources,
            pagination: {
                page,
                limit: query.limit || 10,
                totalPages,
                totalItems
            }
        };
    }

    async getResourceByUserId(userId, query) {
        const totalItems = await resourceRepository.countResourcesByUserId(userId, query);
        const { skip, limit, page, totalPages } = getPagination(query, totalItems);
        const resources = await resourceRepository.getResourcesByUserIdWithPagination(userId, skip, limit);
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new APIError(statusCodeUtility.NotFound, "User not found");
        }
        if (!resources) {
            throw new APIError(statusCodeUtility.NotFound, "No resources found for this user");
        }
        return {
            resources,
            user,
            pagination: {
                page,
                limit,
                totalPages,
                totalItems
            }
        };
    }

    async getResourceById(resourceId) {
        const resource = await resourceRepository.getResourceById(resourceId);
        if (!resource) {
            throw new APIError(statusCodeUtility.NotFound, "Resource not found");
        }
        return resource;
    }

    async createResource(resourceData) {
        const newResource = await resourceRepository.createResource(resourceData);
        return newResource;
    }

    async updateResource(resourceId, resourceData) {
        const updatedResource = await resourceRepository.updateResource(resourceId, resourceData);
        return updatedResource;
    }

    async deleteResource(resourceId, id) {
        const resource = await resourceRepository.getResourceById(resourceId);
        if (!resource) {
            return ResponseHandler(
                statusCodeUtility.NotFound,
                messages.resource.notFoundById,
                null,
                response
            );
        }
        if (resource.userId.toString() !== id) {
            return ResponseHandler(
                statusCodeUtility.Unauthorized,
                messages.auth.unauthorized,
                null,
                response
            );
        }
        const deletedResource = await resourceRepository.deleteResource(resourceId);
        if (!deletedResource) {
            throw new APIError(statusCodeUtility.NotFound, "Resource not found");
        }
        return deletedResource;
    }
}

export default new ResourceService();