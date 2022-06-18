const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { specificUserData, createJWT } = require('../utils');

const register = async (req, res) => {
    // in order to avoid someone to enter an admin value to the role in postman for example..
    // we will destructure the req.body object to all the fields except the role
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password
    });

    res.status(201).json({
        message: 'User created successfully'
    });
};

const login = async (req, res) => {

    if (!req.body.email || !req.body.password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({email: req.body.email});

    if (!user) {
        throw new UnauthenticatedError('Wrong credentials - email');
    }

    const isCorrectPassword = await user.comparePassword(req.body.password);

    if (!isCorrectPassword) {
        throw new UnauthenticatedError('Wrong credentials - password');
    }

    const userDataForResponse = specificUserData(user);

    const token = createJWT(userDataForResponse);

    res.status(200).json({
        message: 'You have successfully logged in',
        user: userDataForResponse,
        token,
    });
};

const logout = async (req, res) => {
    // to remove the cookie we change its value with whatever string we want
    // and also set the expires option to the present time
    // res.cookie('token', '', {
    //     httpOnly: true,
    //     expires: new Date(Date.now())
    // })
    res.status(200).json({message: 'You have successfully logged out'});
};

module.exports = {
    register,
    login,
    logout
};