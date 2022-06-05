const { connect } = require('mongoose');

const connectDB = async (uri) => {
    return connect(uri);
};

module.exports = connectDB;