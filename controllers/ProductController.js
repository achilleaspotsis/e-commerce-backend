const path = require('path');
const Product = require('../models/Product');
const Review = require('../models/Review');
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
        responseMsg = 'There are no products yet';
    }

    res.status(200).json({
        message: responseMsg,
        hits,
        products
    });
};

const getSingleProduct = async (req, res) => {
    // 1st implementation of populating a single product with its reviews --> virtuals
    const product = await Product.findById(req.params.id).populate('reviews'); // this populate is coming from a virtual

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
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new NotFoundError(`We did not find anything with the specified value ${req.params.id}`);
    }

    // we use the remove method and not the findOneAndDelete cause the remove method triggers a hook in the specific Model
    await product.remove();

    res.status(200).json({message: 'Product removed successfully'});
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

// 2nd implementation of populating a single product with its reviews --> creating new controller
// with this implementation we can query(select) whatever we want from the review model, that is not possible with virtuals
const getSingleProductReviews = async (req, res) => {
    const productId = req.params.id;

    const reviews = await Review.find({product: productId});

    let hits = reviews.length;
    let responseMsg = 'Single product reviews fetched successfully';

    if (hits === 0) {
        responseMsg = 'There are no reviews for this product yet';
    }

    res.status(200).json({
        message: responseMsg,
        hits,
        reviews,
    })

};

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    getSingleProductReviews
};