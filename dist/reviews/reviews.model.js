"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = exports.reviewSchema = void 0;
const Mongoose = require("mongoose");
exports.reviewSchema = new Mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: true,
        maxlength: 500
    },
    restaurant: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
exports.Review = Mongoose.model('Review', exports.reviewSchema);
