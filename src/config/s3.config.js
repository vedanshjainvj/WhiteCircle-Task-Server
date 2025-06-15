// -------------------- PACKAGE IMPORT FILES -------------------- //
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// -------------------- LOCAL IMPORT FILES -------------------- //
import { envProvider } from '../constants.js';
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: envProvider.AWS_ACCESS_KEY_ID,
    secretAccessKey: envProvider.AWS_SECRET_ACCESS_KEY,
    region: envProvider.AWS_REGION,
});

export default s3;