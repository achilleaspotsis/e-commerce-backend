const router = require('express').Router();
const { createOrder, updateOrder, getAllOrders, getCurrentUserOrders, getSingleOrder } = require('../controllers/OrderController');
const { authorizePermissions } = require('../middlewares/auth');

router.route('/')
    .post(createOrder)
    .get(authorizePermissions('admin'), getAllOrders);

router.route('/showAllMyOrders')
    .get(getCurrentUserOrders);

router.route('/:id')
    .get(getSingleOrder)
    .patch(updateOrder);

module.exports = router;