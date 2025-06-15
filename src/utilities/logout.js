import ResponseHandler from "./apiResponse.js";
import statusCodeUtility from "./statusCodeUtility.js";

export default async function logout(request, response) {

    response.cookie("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 0,
        expires: new Date(0)
    });

    return ResponseHandler(
        statusCodeUtility.Success,
        "Logout successful",
        null,
        response,
    );
}



