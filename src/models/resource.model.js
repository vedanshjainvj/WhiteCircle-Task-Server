// -------------------- PACKAGE IMPORT FILES -------------------- //
import mongoose from 'mongoose';

const metaDataSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        default: ''
    },
    fileType: {
        type: String,
        required: true,
        enum: ['pdf', 'doc', 'docx', 'img'],
        lowercase: true
    },
    expiryDate: {
        type: Date,
        default: null
    },
});

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    resourceUrl: {
        type: String,
        required: true,
        trim: true
    },
    metaData: metaDataSchema,
}, {
    timestamps: true
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;