import mongoose, {isValidObjectId} from "mongoose";
import {AsyncHandler} from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import {Tweet} from "../models/tweet.model.js";

const createTweet = AsyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    const ownerId = req.user?._id;

    if(!isValidObjectId(ownerId)){
        throw new ApiError(404, "Invalid Id or you must be logged In!")
    }

    if(!content){
        throw new ApiError(400, "Content field must not be empty!")
    }

    const createdTweet = await Tweet.create({
        content,
        owner: ownerId
    })

    if(!createdTweet){
        throw new ApiError(500, "Something went wrong while creating tweet!")
    }

    return res.status(201)
    .json(new ApiResponse(200, createdTweet, "Tweet created successfully!"))
})

const getUserTweets = AsyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user Id!")
    }

    const tweets = await Tweet.find({owner: userId}).sort({createdAt: -1})

    if(!tweets){
        throw new ApiError(404, "No tweets found!")
    }

    return res.status(201)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully!"))
})

const updateTweet = AsyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params;
    const {content} = req.body;
    const userId = req.user?._id;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id!")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found!")
    }

    if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError(400, "You can only update your own tweet!")
    }

    if(!content) {
        throw new ApiError(400, "Content field is required!")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content : content
            }
        },
        {
            new: true
        }
    )

    if(!updatedTweet){
        throw new ApiError(500, "Something went wrong while updating Tweet!")
    }

    return res.status(201)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated Successfully!"))
})

const deleteTweet = AsyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;
    const userId = req.user?._id;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id!")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found!")
    }

    if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError(400, "You can only delete your own tweet!")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(500, "Something went wrong while deleting the tweet!")
    }

    return res.status(201)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully!"))

})

export {createTweet, getUserTweets, deleteTweet, updateTweet}