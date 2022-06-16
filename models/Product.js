const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: ['true', 'Product name is a required field'],
            trim: true,
            minlength: [3, 'Product name must have at least 3 characters'],
            maxlength: [50, 'Product name can\'t be more than 50 characters']
        },
        price: {
            type: Number,
            required: ['true', 'Product price is a required field'],
            default: 0
        },
        description: {
            type: String,
            required: ['true', 'Product description is a required field'],
            maxlength: [1000, 'Product description can\'t be more than 1000 characters']
        },
        image: {
            type: String,
            default: '/uploads/default.jpg'
        },
        category: {
            type: String,
            required: ['true', 'Product category is a required field'],
            enum: ['office', 'kitchen', 'bedroom']
        },
        company: {
            type: String,
            required: ['true', 'Product company is a required field'],
            enum: ['ikea', 'liddy', 'marcos']
        },
        colors: {
            type: [String],
            required: true,
            default: ['#222']
        },
        featured: {
            type: Boolean,
            default: false
        },
        freeShipping: {
            type: Boolean,
            default: false
        },
        inventory: {
            type: Number,
            required: true,
            default: 15
        },
        averageRating: {
            type: Number,
            default: 0
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Product', ProductSchema);