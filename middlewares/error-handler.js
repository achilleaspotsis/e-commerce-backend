const errorHandlerMiddleware = async (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || 500,
        message: err.message || 'Something went wrong, please try again later..'
    };

    if (err.code && err.code === 11000) {
        customError.message = `This ${Object.keys(err.keyValue)} is already used`;
        customError.statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        customError.statusCode = 400;
        
        if (Object.values(err.errors)[0].kind === 'required') {
            customError.message = 'All fields must be provided';
        } else {
            customError.message = Object.values(err.errors).map(field => field.message);
        }
    }

    if (err.name === 'CastError') {
        customError.message = `We did not find anything with the specified value: ${err.value}`;
        customError.statusCode = 404;
    }

    console.log(err);
    return res.status(customError.statusCode).json({message: customError.message});
    // return res.status(customError.statusCode).json(err);
};

module.exports = errorHandlerMiddleware;