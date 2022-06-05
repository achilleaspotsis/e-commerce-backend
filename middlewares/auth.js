const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { verifyToken } = require("../utils");

const authenticateUser = async (req, res, next) => {
    // const token = req.signedCookies.token;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Invalid Authentication');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const {id, name, email, role} = verifyToken(token);
        req.user = {id, name, email, role};
        req.token = token;
        next();
    } catch (err) {
        throw new UnauthenticatedError('Invalid Authentication');
    }
};

// method that allows access to only those that have specific roles
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    }
};

module.exports = {
    authenticateUser,
    authorizePermissions
}