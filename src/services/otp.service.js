// -------------------- PACKAGE IMPORT FILES -------------------- //
import nodemailer from "nodemailer";

// --------------- Importing Other Files --------------- //
import { envProvider } from "../constants.js";
import otpRepository from "../repository/otp.repository.js";
import { otpEmailTemplate } from "../utilities/otpEmail.js";
import userRepository from "../repository/user.repository.js";

class OtpService {

    async Generateotp({ email }) {
        const otp = Math.floor(1000 + Math.random() * 9000);
        const expireTime = Date.now() + 10 * 60 * 1000;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: envProvider.EMAIL,
                pass: envProvider.PASSWORD,
            },
        });

        const mailOptions = {
            from: "<Whitecircle no-reply@whitecircle.testmail>",
            to: email,
            subject: "OTP Verification for Whitecircle",
            html: otpEmailTemplate(otp)
        };

        try {
            await otpRepository.deleteOtpByEmail(email);

            let info = await transporter.sendMail(mailOptions);
            if (info.accepted.includes(email)) {
                await otpRepository.createOtp({
                    email: email,
                    code: otp,
                    expiry: expireTime
                });
                console.log("OTP sent successfully to:", email);
                return "OTP sent successfully";
            } else {
                console.log("Mail not accepted:", info);
                return "Mail sending failed";
            }
        } catch (error) {
            console.error("Error in sending mail:", error);
            return "Error in sending mail";
        }
    }


    async verifyOtp({ email, otp }) {
        const currentTime = Date.now();
        try {
            const user = await otpRepository.findOtp({
                email: email,
                code: otp,
                expiry: { $gt: currentTime }
            });

            if (!user) {
                throw new Error("Invalid or expired OTP");
            }

            if (user) {
                await otpRepository.deleteOtp(user._id);
                const updatedUser = await userRepository.updateUser(
                    { email: email },
                    {
                        $set: { isVerified: true }
                    }
                );
                return updatedUser.isVerified;
            }

        } catch (error) {
            console.error("Error in verifying OTP:", error);
            return false;
        }
    }

}

export default new OtpService();