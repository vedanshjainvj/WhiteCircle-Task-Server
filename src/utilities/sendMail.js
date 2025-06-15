// -------------------- PACKAGE IMPORT FILES -------------------- //
import nodemailer from "nodemailer";

// --------------- Importing Other Files --------------- //
import { resourceExpiryReminderText } from "./remainderMail.js";
import { envProvider } from "../constants.js";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: envProvider.EMAIL,
        pass: envProvider.PASSWORD,
    },
});

export const sendResourceExpiryReminder = async (resource) => {
    const mailOptions = {
        from: '"Whitecircle" <no-reply@whitecircle.testmail>',
        to: resource.userEmail,
        subject: "Resource Expiry Reminder",
        html: resourceExpiryReminderText(resource),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📤 SendMail response for ${resource.userEmail}:`, info);

        if (info.accepted.includes(resource.userEmail)) {
            return {
                message: "Mail sent successfully",
                resourceId: resource.resourceId,
                userEmail: resource.userEmail,
            };
        } else {
            return {
                message: "Mail sending failed",
                resourceId: resource.resourceId,
                userEmail: resource.userEmail,
            };
        }

    } catch (error) {
        console.error(`🚨 Error sending mail to ${resource.userEmail}:`, error);
        return {
            message: "Error in sending mail",
            resourceId: resource.resourceId,
            userEmail: resource.userEmail,
        };
    }
};
