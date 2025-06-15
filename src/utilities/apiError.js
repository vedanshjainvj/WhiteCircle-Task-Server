class APIError extends Error{
    constructor(statuscode, message){
        console.log(statuscode, message)
        super(message);
        this.message = message,
        this.statuscode = statuscode
    }
}

export default APIError