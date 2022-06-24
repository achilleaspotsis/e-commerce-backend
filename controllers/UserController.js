const User = require("../models/User");
const { NotFoundError, BadRequestError, UnauthenticatedError } = require("../errors");
const { specificUserData, createJWT, checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
    const users = await User.find({role: 'user'}).select('-password');

    let hits = users.length;
    let responseMsg = 'Users fetched successfully';

    if (hits === 0) {
        responseMsg = 'There are no users yet';
    }

    res.status(200).json({
        message: responseMsg,
        hits,
        users
    });
};

const getSingleUser = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password -role -updatedAt -__v');

    if (!user) {
        throw new NotFoundError(`We did not find anything with the specified value ${req.params.id}`);
    }
    
    checkPermissions(req.user, user);

    res.status(200).json({
        message: `${user.name} fetched successfully`,
        user
    });
};

const showCurrentUser = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
};

const updateUser = async (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        throw new BadRequestError('Your fields cannot be empty, please provide values');
    }
    
    if (name === req.user.name && email === req.user.email) {
        throw new BadRequestError('You have to change at least one of your initial values');
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email },
        { new: true, runValidators: true}  
    );

    const userDataForResponse = specificUserData(user);
    
    // attachCookiesToResponse(userDataForResponse, res);

    const token = createJWT(userDataForResponse);
    
    res.status(200).json({
        message: 'User updated successfully',
        user: userDataForResponse,
        token,
    });
};

const updatePassword = async (req, res) => {
    if (!req.body.oldPassword || !req.body.newPassword) {
        throw new BadRequestError('Both fields are required');
    }
    const user = await User.findById(req.user.id);

    const oldPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if (!oldPasswordMatch) {
        throw new UnauthenticatedError('Wrong credentials');
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
        message: 'Your password has been updated successfully'
    });
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updatePassword
}