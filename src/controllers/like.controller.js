import mongoose, {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/apiError.utils";
import { AsyncHandler } from "../utils/asyncHandler.utils";
import { ApiResponse } from "../utils/apiResponse.utils";
import { Like } from "../models/like.model";

const toggleVideoLike = AsyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user?._id
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Not a valid Video Id!")
    }

    const isAlreadyLikedVideo = await Like.findOne({video: videoId, likedBy: userId})

    if(isAlreadyLikedVideo){
        await Like.findByIdAndDelete(isAlreadyLikedVideo._id);
        return res.status(201)
        .json(new ApiResponse(200, isAlreadyLikedVideo, "Video Unliked Successfully!"))
    }

    const likedVideo = await Like.create({
        video: videoId,
        likedBy: userId
    })

    return res.status(201)
    .json(new ApiResponse(200, likedVideo, "Video liked Successfully!"))
})

const toggleCommentLike = AsyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const userId = req.user?._id
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id!")
    }

    const isAlreadyLikedComment = await Like.findOne({comment: commentId, likedBy: userId})

    if(isAlreadyLikedComment){
        await Like.findByIdAndDelete(isAlreadyLikedComment._id);
        return res.status(201)
        .json(new ApiResponse(200, isAlreadyLikedComment, "Comment Unliked Successfully!"))
    }

    const likedComment = await Like.create({
        comment: commentId,
        likedBy: userId
    })

    return res.status(201)
    .json(new ApiResponse(200, likedComment, "Video liked Successfully!"))

})

const toggleTweetLike = AsyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const userId = req.user?._id
    //TODO: toggle like on comment

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id!")
    }

    const isAlreadyLikedTweet = await Like.findOne({tweet: tweetId, likedBy: userId})

    if(isAlreadyLikedTweet){
        await Like.findByIdAndDelete(isAlreadyLikedTweet._id);
        return res.status(201)
        .json(new ApiResponse(200, isAlreadyLikedTweet, "Comment Unliked Successfully!"))
    }

    const likedTweet = await Like.create({
        tweet: tweetId,
        likedBy: userId
    })

    return res.status(201)
    .json(new ApiResponse(200, likedTweet, "Video liked Successfully!"))

})

const getLikedVideos = AsyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id;

    const likedVideos = await Like.find(
        {
            likedBy: userId,
            video: {$exists: true}
        }
    ).populate("video", "_id title url")

    if(!likedVideos){
        throw new ApiError(404, "Videos not found!")
    }

    return res.status(201)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched Successfully!"))
})

export {toggleVideoLike, getLikedVideos, toggleTweetLike, toggleCommentLike}