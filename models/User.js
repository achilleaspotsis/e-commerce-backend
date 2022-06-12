const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');
const emailRegex = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: ['true', 'Name is a required field'],
            minlength: [3, 'Name must have at least 3 characters'],
            maxlength: [30, 'Name can\'t be more than 30 characters']
        },
        email: {
            type: String,
            unique: true,
            required: ['true', 'Email is a required field'],
            match: [emailRegex, 'Please provide a valid email']
        },
        password: {
            type: String,
            required: ['true', 'Password is a required field'],
            minlength: [6, 'Password must have at least 6 characters']
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

// bcrypt functionality
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function (registerUserPassword) {
    const isMatch = await bcrypt.compare(registerUserPassword, this.password);
    return isMatch;
};

module.exports = model('User', UserSchema);