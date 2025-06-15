// -------------------- PACKAGE IMPORT FILES -------------------- //
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    userProfile: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});


const User = mongoose.model('User', userSchema);

export default User;