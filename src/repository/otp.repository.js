// --------------- Importing Other Files --------------- //
import Otp from "../models/otp.model.js";

class OtpRepository {

    // ------------- Generate OTP ---------//
    async createOtp(data) {
        const otp = new Otp(data);
        return await otp.save();
    }

    // ------------- Find OTP ---------//
    async findOtp(query) {
        const otpResponse = await Otp.findOne(
            query
        );
        return otpResponse;
    }

    // ------------- Delete OTP ---------//
    async deleteOtp(id) {
        return await Otp.findByIdAndDelete(id);
    }

    // ------------- Delete OTP by Email ---------//
    async deleteOtpByEmail(email) {
        return await Otp.deleteOne({ email: email });
    }
}

export default new OtpRepository();
