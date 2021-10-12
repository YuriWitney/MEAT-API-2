import * as Mongoose from "mongoose"
import { Restaurant } from "../restaurants/restaurants.model"
import { User } from "../users/users.model"

export interface Review extends Mongoose.Document {
    date: Date,
    rating: Number,
    comments: String,
    Restaurant: Mongoose.Schema.Types.ObjectId | Restaurant,
    User: Mongoose.Schema.Types.ObjectId | User
}

export const reviewSchema = new Mongoose.Schema({
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
})

export const Review = Mongoose.model<Review>('Review', reviewSchema)