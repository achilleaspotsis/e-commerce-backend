const { Schema, model } = require('mongoose');

const OrderItemSchema = new Schema(
    {
        name: {
            type: String,
            required: ['true', 'Item name is required'],
        },
        price: {
            type: Number,
            required: ['true', 'Item price is required'],
        },
        image: {
            type: String,
            required: ['true', 'Item image is required'],
        },
        amount: {
            type: Number,
            required: ['true', 'Item amount is required'],
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
    },
    {
        timestamps: true
    }
);

const OrderSchema = new Schema(
    {
        orderItems: [OrderItemSchema],
        tax: {
            type: Number,
            required: ['true', 'Tax is required'],
        },
        shippingFee: {
            type: Number,
            required: ['true', 'Shipping fee is required'],
        },
        subtotal: {
            type: Number,
            required: ['true', 'Subtotal price is required'],
        },
        total: {
            type: Number,
            required: ['true', 'Total price is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'failed', 'paid', 'cancelled', 'delivered'],
            default: 'pending'
        },
        clientSecret: {
            type: String,
            required: true
        },
        paymentIntentId: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = model('Order', OrderSchema);