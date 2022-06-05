const jwt = require('jsonwebtoken');

const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
    return token;
};

// const attachCookiesToResponse = (userData, res) => {
//     const token = createJWT(userData);

//     const oneDay = 1000 * 60 * 60 * 24;

//     // Implementation to store token on cookies
//     res.cookie('token', token, {
//         httpOnly: true,
//         expires: new Date(Date.now() + oneDay),
//         secure: process.env.NODE_ENV === 'production',
//         signed: true // using this flag will have to pass an environment secret variable when invoking the cookie-parser middleware
//     });
// };

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
    createJWT,
    verifyToken
}