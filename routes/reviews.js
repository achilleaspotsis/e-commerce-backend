const router = require('express').Router();
const { createReview, getAllReviews, getSingleReview, updateReview, deleteReview } = require('../controllers/ReviewController');
const { authenticateUser } = require('../middlewares/auth');

router.route('/')
    .post(authenticateUser, createReview)
    .get(getAllReviews);

router.route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

module.exports = router;