const path = require('path');
const Product = require('../models/Product');
const { NotFoundError, BadRequestError } = require('../errors');

const createProduct = async (req, res) => {
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
        message: 'Product created successfully',
        product
    });
};

const getAllProducts = async (req, res) => {
    const products = await Product.find({});

    let hits = products.length;
    let responseMsg = 'Products fetched successfully';

    if (hits === 0) {
        responseMsg = 'There are no products available yet';
    }

    res.status(200).json({
        message: responseMsg,
        hits,
        products
    });
};

const getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new NotFoundError(`We did not find anything with the specified value ${req.params.id}`);
    }

    res.status(200).json({
        message: 'Single product fetched successfully',
        product
    });
};

const updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
    });

    if (!product) {
        throw new NotFoundError(`We did not find anything with the specified value ${req.params.id}`);
    }

    res.status(200).json({
        message: 'Product updated successfully',
        product
    });
};

const deleteProduct = async (req, res) => {
    await Product.deleteOne({_id: req.params.id});

    res.status(200).json({message: 'Product deleted successfully'});
};

const uploadImage = async (req, res) => {
    let sampleFile;
    let uploadPath;

    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        throw new BadRequestError('No files were uploaded');
    }

    sampleFile = req.files.image;

    if (!sampleFile.mimetype.startsWith('image')) {
        throw new BadRequestError('Please upload image');
    }

    uploadPath = path.join(__dirname, `../public/uploads/${sampleFile.name}`);

    await sampleFile.mv(uploadPath);

    res.status(200).json({message: `Your file has been successfully uploaded on: /uploads/${sampleFile.name}`});
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};