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
        // for (let i = 0; i < err.errors.length; i++) {
        //     console.log(err.errors[i]);
        //     if (err.errors[i].kind === 'required') {
        //         customError.message = Object.values(err.errors).map(field => `${field.path} field is required`);
        //     } else {
        //         customError.message = Object.values(err.errors).map(field => field.message);
        //     }
        // }
        // if ((Object.values(err.errors)).kind === 'required') {
        //     customError.message = Object.values(err.errors).map(field => `${field.path} field is required`);
        // } else {
        //     customError.message = Object.values(err.errors).map(field => field.message);
        // }
        customError.message = Object.values(err.errors).map(field => field.message);
        customError.statusCode = 400;
    }

    if (err.name === 'CastError') {
        customError.message = `We did not find anything with the specified value: ${err.value}`;
        customError.statusCode = 404;
    }

    console.log(err);
    return res.status(customError.statusCode).json({message: customError.message});
};

module.exports = errorHandlerMiddleware;