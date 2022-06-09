const User = require("../models/User");
const { NotFoundError, BadRequestError, UnauthenticatedError } = require("../errors");
const { specificUserData, createJWT } = require("../utils");
const checkPermissions = require("../utils/check-permissions");

const getAllUsers = async (req, res) => {
    const users = await User.find({role: 'user'}).select('-password');

    if (!users) {
        return res.status(200).json({message: 'There are no users available'})
    }

    res.status(200).json({
        users,
        message: 'Users fetched successfully'
    });
};

const getSingleUser = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password -role -updatedAt -__v');

    if (!user) {
        throw new NotFoundError(`We did not find anything with the specified value ${req.params.id}`);
    }
    
    checkPermissions(req.user, user);

    res.status(200).json({
        user,
        message: `${user.name} fetched successfully`
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
    
    if (name === req.user.name || email === req.user.email) {
        throw new BadRequestError('You have to change your initial values');
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
        token,
        user: userDataForResponse,
        message: 'User updated successfully'
    });
};

const updateUserPassword = async (req, res) => {
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
    updateUserPassword
}