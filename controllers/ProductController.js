const path = require('path');
const { NotFoundError, BadRequestError } = require('../errors');
const Product = require('../models/Product');

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

    if (!products) {
        return res.status(200).json({message: 'There are no products yet'})
    }

    let hits = products.length;

    res.status(200).json({
        message: 'Products fetched successfully',
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

    res.status(200).json('Product deleted successfully');
};

const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new BadRequestError('No file uploaded');
    }

    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith('image')) {
        throw new BadRequestError('Please upload image');
    }

    const imagePath = path.join(__dirname, `../public/uploads/${productImage.name}`);

    await productImage.mv(imagePath);

    res.status(200).json({image: `/uploads/${productImage.name}`});
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};