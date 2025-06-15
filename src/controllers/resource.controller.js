// --------------- Importing Other Files --------------- //
import  S3Service from "../utilities/awsS3.js";
import ResponseHandler from "../utilities/apiResponse.js";
import resourceService from "../services/resource.service.js";
import statusCodeUtility from "../utilities/statusCodeUtility.js";
import resourceRepository from "../repository/resource.repository.js";

const messages = {
    resource: {
        fetched: "Resources fetched successfully",
        notFound: "No resources found",
        error: "Error fetching resources",
        created: "Resource created successfully",
        updated: "Resource updated successfully",
        deleted: "Resource deleted successfully",
        notFoundById: "Resource not found with the given ID",
        IdNotProvided: "Resource ID not provided",
        invalidMetaData: "Invalid metadata format",
        uploadFailed: "Failed to upload file",
        requiredFields: "Title, metadata, and file are required to create a resource",
        errorUpdate: "Error updating resource",
    },
    auth: {
        NotFound: "User token not found",
        unauthorized: "User not authenticated",
        notAuthorized: "You are not authorized to perform this action"
    },

};

class ResourceController {

    async getResources(request, response, next) {
        const { id, name, email, role } = request.user;

        if (!id) {
            return ResponseHandler(
                statusCodeUtility.Unauthorized,
                messages.auth.unauthorized,
                null,
                response
            );
        }

        else {
            const resources = await resourceService.getResourceWithPagination(id, request.query);
            return ResponseHandler(
                statusCodeUtility.Success,
                messages.resource.fetched,
                resources,
                response
            );
        }
    }

    async getResourcesByUserId(request, response, next) {
        const { id } = request.user;
        const { userId } = request.params;
        console.log(userId, id);

        if (!id && !userId) {
            return ResponseHandler(
                statusCodeUtility.Unauthorized,
                messages.auth.unauthorized,
                null,
                response
            );
        }

        else {
            const { resources, user, pagination } = await resourceService.getResourceByUserId(userId, request.query);
            return ResponseHandler(
                statusCodeUtility.Success,
                messages.resource.fetched,
                {
                    resources,
                    user,
                    pagination
                },
                response
            );
        }
    }


    async getResourceById(request, response, next) {
        const { id } = request.user;
        const resourceId = request.params.id;

        if (!id) {
            return ResponseHandler(
                statusCodeUtility.Unauthorized,
                messages.auth.unauthorized,
                null,
                response
            );
        }
        if (!resourceId) {
            return ResponseHandler(
                statusCodeUtility.BadRequest,
                messages.resource.IdNotProvided,
                null,
                response
            );
        }

        else {
            const resource = await resourceService.getResourceById(resourceId);
            return ResponseHandler(
                statusCodeUtility.Success,
                messages.resource.fetched,
                resource,
                response
            );
        }
    }

    async createResource(request, response, next) {
        const { id, name } = request.user;
        const { title, metaData } = request.body;

        if (!id) {
            return ResponseHandler(
                statusCodeUtility.Unauthorized,
                messages.auth.unauthorized,
                null,
                response
            );
        };
        let parsedMetaData;
        try {
            parsedMetaData = typeof metaData === 'string' ? JSON.parse(metaData) : metaData;
        } catch (error) {
            return ResponseHandler(
                statusCodeUtility.BadRequest,
                messages.resource.invalidMetaData,
                null,
                response
            );
        }
        if (!title || !parsedMetaData || !request.file || !parsedMetaData.fileType) {
            return ResponseHandler(
                statusCodeUtility.BadRequest,
                messages.resource.requiredFields,
                null,
                response
            );
        };

        const fileToUpload = request.file;
        const resourceUrl = await S3Service.uploadFileToS3(fileToUpload, fileToUpload.mimetype.split('/')[0]);

        if (!resourceUrl) {
            return ResponseHandler(
                statusCodeUtility.InternalServerError,
                messages.resource.uploadFailed,
                null,
                response
            );
        }

        else {
            const resourceResponse = await resourceRepository.createResource({
                title,
                userName: name,
                userId: id,
                resourceUrl,
                metaData: parsedMetaData,
            });

            if (!resourceResponse) {
                await S3Service.deleteFileFromS3(resourceUrl);
                return ResponseHandler(
                    statusCodeUtility.InternalServerError,
                    messages.resource.error,
                    null,
                    response
                );
            }

            return ResponseHandler(
                statusCodeUtility.Success,
                messages.resource.created,
                resourceResponse,
                response
            );

        }
    }


    async updateResource(request, response, next) {
        const { id } = request.user;
        const resourceId = request.params.id;
        if (!id) {
            return ResponseHandler(
                statusCodeUtility.Unauthorized,
                messages.auth.unauthorized,
                null,
                response
            );
        }
        const data = request.body;
        const { metaData } = data;
        if (request.file) {
            if (!data.metaData || !data.metaData.fileType) {
                return ResponseHandler(
                    statusCodeUtility.BadRequest,
                    messages.resource.requiredFields,
                    null,
                    response
                );
            }
            const getResource = await resourceService.getResourceById(resourceId);
            await S3Service.deleteFileFromS3(getResource.resourceUrl);
            const fileToUpload = request.file;
            data.resourceUrl = await S3Service.uploadFileToS3(fileToUpload, fileToUpload.mimetype.split('/')[0]);
        }

        let parsedMetaData;
        try {
            parsedMetaData = typeof metaData === 'string' ? JSON.parse(metaData) : metaData;
        } catch (error) {
            return ResponseHandler(
                statusCodeUtility.BadRequest,
                messages.resource.invalidMetaData,
                null,
                response
            );
        }

        if (!parsedMetaData || !parsedMetaData.fileType) {
            return ResponseHandler(
                statusCodeUtility.BadRequest,
                messages.resource.requiredFields,
                null,
                response
            );
        }

        const resourceResponse = await resourceService.updateResource(resourceId, {
            ...data,
            metaData: parsedMetaData,
            userId: id
        });
        if (!resourceResponse) {
            await S3Service.deleteFileFromS3(data.resourceUrl);
            return ResponseHandler(
                statusCodeUtility.InternalServerError,
                messages.resource.errorUpdate,
                null,
                response
            );
        }
        return ResponseHandler(
            statusCodeUtility.Success,
            messages.resource.updated,
            resourceResponse,
            response
        );
    }

    async deleteResource(request, response, next) {
        const { id } = request.user;
        const resourceId = request.params.id;
        if (!id) {
            return ResponseHandler(
                statusCodeUtility.Unauthorized,
                messages.auth.unauthorized,
                null,
                response
            );
        }
        if (!resourceId) {
            return ResponseHandler(
                statusCodeUtility.BadRequest,
                messages.resource.IdNotProvided,
                null,
                response
            );
        }
        const resource = await resourceService.deleteResource(resourceId, id);
        await S3Service.deleteFileFromS3(resource.resourceUrl);
        return ResponseHandler(
            statusCodeUtility.Success,
            messages.resource.deleted,
            null,
            response
        );
    }
}

export default new ResourceController();