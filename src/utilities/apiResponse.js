// --------------- Importing Other Files --------------- //
import statusCodeUtility from "./statusCodeUtility.js"

const ResponseHandler = (statusCode=statusCodeUtility.Success, message = "Request Completed Successfully", 
    data=null, response) => {
    return response.status(statusCode).send({ message, data });
}

export const ResponseRedirectHandler = (statusCode, URI, response) => {
    response.set("Access-Control-Allow-Origin", "http://localhost:4000");
    return response.redirect(statusCode, URI);
};

export default ResponseHandler