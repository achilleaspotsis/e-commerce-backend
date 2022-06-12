const Product = require('../models/Product');

const createProduct = async (req, res) => {
    res.send('Create product');
};

const getAllProducts = async (req, res) => {
    res.send('All products');
};

const getSingleProduct = async (req, res) => {
    res.send('Single Product');
};

const updateProduct = async (req, res) => {
    res.send('Update product');
};

const deleteProduct = async (req, res) => {
    res.send('Delete product');
};

const uploadImage = async (req, res) => {
    res.send('Upload image');
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};