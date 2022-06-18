const router = require('express').Router();
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage, getSingleProductReviews } = require('../controllers/ProductController');
const { authorizePermissions, authenticateUser } = require('../middlewares/auth');

router.route('/')
    .post([authenticateUser, authorizePermissions('admin')], createProduct)
    .get(getAllProducts);

router.route('/uploadImage')
    .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router.route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

router.route('/:id/reviews')
    .get(getSingleProductReviews)

module.exports = router;