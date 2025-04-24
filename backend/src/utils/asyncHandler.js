const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    return await requestHandler(req,res,next)
  } catch (err) {
    console.log('Async Error: ', err)

     // Ensure the status code is valid (between 100 and 599)
        const statusCode = err.statusCode && err.statusCode >= 100 && err.statusCode < 600 
            ? err.statusCode 
            : 500;
    
    
        res.status(statusCode).json({
            success: false,
            statuscode: statusCode,
            message: err.message || "Internal Server Error",
        });
  }
}

export { asyncHandler }