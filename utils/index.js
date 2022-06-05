const { createJWT, verifyToken } = require('./jwt');
const specificUserData = require('./user-data-for-token');

module.exports = {
    createJWT,
    verifyToken,
    specificUserData
}