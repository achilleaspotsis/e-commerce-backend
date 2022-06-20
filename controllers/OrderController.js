const Order = require('../models/Order');
const Product = require('../models/Product');
const { NotFoundError, BadRequestError } = require('../errors');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({amount, currence}) => {
    const client_secret = 'secret';
    return { client_secret, amount };
};

const createOrder = async (req, res) => {
    const { cartItems, tax, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new BadRequestError('There should be at least one cart item');
    }

    if (!tax || !shippingFee) {
        throw new BadRequestError('Tax and shipping fee must be provided');
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findById(item.product);

        if (!dbProduct) {
            throw new NotFoundError(`We did not find any product with id: ${item.product}`);
        }

        const { name, image, price } = dbProduct;

        // if (name !== item.name || image !== item.image || price !== item.price) {
        //     throw new NotFoundError(`We did not find any product with these values`);
        // }

        const orderItem = {
            name,
            image,
            price,
            amount: item.amount,
            product: item.product
        };

        orderItems = [...orderItems, orderItem];
        subtotal += item.amount * price;
    }

    const total = subtotal + tax + shippingFee;

    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd'
    });

    const order = await Order.create({
        orderItems,
        tax,
        shippingFee,
        subtotal,
        total,
        clientSecret: paymentIntent.client_secret,
        user: req.user.id
    });
    
    res.status(201).json({
        message: 'Your order is ok, procceed to payment',
        clientSecret: order.clientSecret,
        order,
    });
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({});

    let hits = orders.length;
    let responseMsg = 'Orders fetched successfully';

    if (hits === 0) {
        responseMsg = 'There are no orders yet';
    }

    res.status(200).json({
        message: responseMsg,
        hits,
        orders
    });
};

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({user: req.user.id});

    let hits = orders.length;
    let responseMsg = 'Orders fetched successfully';

    if (hits === 0) {
        responseMsg = 'There are no orders yet';
    }

    res.status(200).json({
        message: responseMsg,
        hits,
        orders
    });
};

const getSingleOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new NotFoundError(`We did not find any order with the specified id: ${req.params.id}`);
    }

    checkPermissions(req.user, order.user);

    res.status(200).json({
        message: 'Single order fetched successfully',
        order
    });
};

const updateOrder = async (req, res) => {
    const { paymentIntentId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new NotFoundError(`We did not find any order with the specified id: ${req.params.id}`);
    }

    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(200).json({
        message: 'Order paid successfully',
        order
    });
};

module.exports = {
    createOrder,
    getAllOrders,
    getCurrentUserOrders,
    getSingleOrder,
    updateOrder,
};