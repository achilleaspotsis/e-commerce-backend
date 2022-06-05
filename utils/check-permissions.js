const { UnauthorizedError } = require("../errors");

const checkPermissions = (requestUser, resourceUser) => {
    if (requestUser.role === 'admin') return;
    
    if (requestUser.id === resourceUser._id.toString()) return;
    
    throw new UnauthorizedError('Not authorized to access this route');
};

module.exports = checkPermissions;