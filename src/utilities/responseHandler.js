// --------------- Importing Other Files --------------- //
import statusCodeUtility from "./statusCodeUtility.js"

const ResponseHandler = (statusCode=statusCodeUtility.Success, 
    message = "Request Completed Successfully", data=null, response) => {
    return response.status(statusCode).send({message,data: data})
}

export default ResponseHandler