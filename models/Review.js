const { Schema, model } = require('mongoose');

const ReviewSchema = new Schema(
    {
        rating: {
            type: Number,
            required: ['true', 'Review ratinh is a required field'],
            min: 1,
            max: 5
            // default: 0
        },
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

// with that line of code we are saying that a user can only make one review per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = model('Review', ReviewSchema);