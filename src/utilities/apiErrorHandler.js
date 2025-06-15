// --------------- Importing Other Files --------------- //
import ResponseHandler from "./apiResponse.js";
import statusCodeUtility from "./statusCodeUtility.js";

function Errorhandler(error, request, response, next){
    const statusCode = error.statuscode || statusCodeUtility.InternalServerError;
    const message = error.message || "Internal Server Error"

    return ResponseHandler(statusCode, message, null, response)
}

export default Errorhandler