const asyncHandler = (fun) => async (request, response, next) => {
    try {
        await fun(request, response, next);
    } 
    catch (error) {
        next(error)
    }
}

export default asyncHandler;