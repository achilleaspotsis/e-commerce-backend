const { Schema, model } = require('mongoose');

const ReviewSchema = new Schema(
    {
        title: {
            type: String,
            required: ['true', 'Review title is a required field'],
            trim: true,
            maxlength: [50, 'Review title can\'t be more than 50 characters']
        },
        comment: {
            type: String,
            required: ['true', 'Review comment is a required field'],
        },
        rating: {
            type: Number,
            required: ['true', 'Review rating is a required field'],
            min: 1,
            max: 5
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
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

// 1st implementation for checking a user to have only one review per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = model('Review', ReviewSchema);