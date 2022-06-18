const Review = require('../models/Review');
const Product = require('../models/Product');
const { NotFoundError, BadRequestError } = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
    const { product: productId } = req.body;

    const productExists = await Product.findById(productId);

    if (!productExists) {
        throw new NotFoundError(`No product with id: ${productId}`);
    }

    // 2nd implementation for checking a user to have only one review per product
    const alreadyReviewed = await Review.findOne({
        product: productId,
        user: req.user.id
    });

    if (alreadyReviewed) {
        throw new BadRequestError(`You have already reviewed this product`);
    }

    req.body.user = req.user.id;

    const review = await Review.create(req.body);

    res.status(201).json({
        message: 'Review created successfully',
        review
    });
};

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
        .populate([
            {
                path: 'product',
                select: 'name company price'
            },
            {
                path: 'user',
                select: 'name'
            }
        ]);

    let hits = reviews.length;
    let responseMsg = 'Reviews fetched successfully';

    if (hits === 0) {
        responseMsg = 'There are no reviews yet';
    }

    res.status(200).json({
        message: responseMsg,
        hits,
        reviews
    });
};

const getSingleReview = async (req, res) => {
    const review = await Review.findById(req.params.id)
        .populate([
            {
                path: 'product',
                select: 'name company price'
            },
            {
                path: 'user',
                select: 'name'
            }
        ]);

    if (!review) {
        throw new NotFoundError(`We did not find any review with the specified value ${req.params.id}`);
    }

    res.status(200).json({
        message: 'Single review fetched successfully',
        review
    });
};

const updateReview = async (req, res) => {
    const { title, comment, rating } = req.body;

    if (!title || !comment || !rating) {
        throw new BadRequestError('All fields must be provided');
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
        throw new NotFoundError(`We did not find any review with the specified value ${req.params.id}`);
    }

    checkPermissions(req.user, review.user);

    review.title = title;
    review.comment = comment;
    review.rating = rating;

    await review.save();

    res.status(200).json({
        message: 'Review updated successfully',
        review
    });
};

const deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        throw new NotFoundError(`We did not find any review with the specified value ${req.params.id}`);
    }

    // extra condition to check if the user who is trying to delete the review is the one who has made the review
    checkPermissions(req.user, review.user);

    await review.remove();

    res.status(200).json({ message: 'Review deleted successfully' });
};

module.exports = {
    getAllReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
};