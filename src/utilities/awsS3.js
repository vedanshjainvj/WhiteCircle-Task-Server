// --------------- Importing Other Files --------------- //
import s3 from "../config/s3.config.js";

class S3Service {
    async uploadFileToS3(file, folder) {
        if (!file) {
            throw new Error("No file provided for upload");
        }
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${folder}/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        return new Promise((resolve, reject) => {
            s3.upload(params, (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(data.Location);
            });
        });
    }

    async uploadFilesToS3(files, folder) {
        if (!files || files.length === 0) {
            throw new Error("No files provided for upload");
        }
        const uploadPromises = files.map((file) => this.uploadFileToS3(file, folder));
        return await Promise.all(uploadPromises);
    }

    async deleteFileFromS3(fileUrl) {
        if (!fileUrl) {
            throw new Error("No file URL provided for deletion");
        }
        const fileKey = this.extractFileKey(fileUrl);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        };
        return new Promise((resolve, reject) => {
            s3.deleteObject(params, (error, data) => {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        });
    }

    async deleteFilesFromS3(fileUrls) {
        const fileKeys = fileUrls.map((url) => this.extractFileKey(url));

        if (fileKeys.length === 0) {
            return "No files to delete";
        }

        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: fileKeys.map((key) => ({ Key: key })),
            },
        };

        try {
            const data = await s3.deleteObjects(deleteParams).promise();
            return data;
        } catch (error) {
            throw error;
        }
    }

    extractFileKey(fileUrl) {
        const urlParts = fileUrl.split('/');
        return decodeURIComponent(urlParts.slice(3).join('/'));
    }

}

export default new S3Service();