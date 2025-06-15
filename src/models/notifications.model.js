// -------------------- PACKAGE IMPORT FILES -------------------- //
import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Resource'
    }
})

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification