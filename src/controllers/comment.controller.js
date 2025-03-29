import mongoose, {isValidObjectId} from "mongoose";
import { Comment } from "../models/comment.model.js";
import {AsyncHandler} from "../utils/asyncHandler.utils.js";
import {ApiError} from "../utils/apiError.utils.js";
import {ApiResponse} from "../utils/apiResponse.utils.js"

const getVideoComments = AsyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid VIdeo Id!")
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId);

    const comments =await Comment.aggregate(
        [
            {
                $match: {
                    video: videoObjectId
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "CommentOnVideo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "CommentOwner"
                }
            },
            {
                $project: {
                    content : 1,
                    owner: {
                        $arrayElemAt: ["$CommentOwner", 0]
                    },
                    video: {
                        $arrayElemAt: ["$CommentOnVideo", 0]
                    },
                    createdAt: 1
                }
            },
            {
                $skip: (page - 1) * parseInt(limit),
            },
          
            {
                $limit: parseInt(limit),
            },
        ]
    )

    if(!comments.length){
        throw new ApiError(404, "Comment not found!")
    }

    return res.status(201)
    .json(new ApiResponse(200, comments, "Comments fetched successfully!"))

})

const addComment = AsyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id!")
    }

    if(!req.user){
        throw new ApiError(400, "User needs to be logged In!")
    }

    const {content} = req.body;
    if(!content){
        throw new ApiError(400, "Empty or null fields are invalid!")
    }

    const addedComment = await Comment.create({
        content,
        video : videoId,
        owner: req.user?._id
    })

    if(!addComment){
        throw new ApiError(400, "Something went wrong while adding comment!")
    }

    return res.status(201)
    .json(new ApiResponse(200, addComment, videoId, "Added comment successfully!"))
})

const updateComment = AsyncHandler( async(req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id!")
    }

    if(!req.user){
        throw new ApiError(400, "User must be logged In!")
    }

    if(!content){
        throw new ApiError(400, "Content field cannot be empty or null!")
    }

    const updatedComment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user?._id
        },
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    if(!updateComment){
        throw new ApiError(400, "Error while updating comment!")
    }

    res.status(201)
    .json(200, updateComment, "Comment updated successfully!")
})

const deleteComment = AsyncHandler( async (req, res) => {
    const {commentId} = req.params;

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Comment Id is not valid!")
    }

    if(!req.user){
        throw new ApiError(400, "User must be logged In!")
    }

    const deleteComment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user?._id
    })

    return res.status(201)
    .json(new ApiResponse(200, deleteComment, "Comment delete successfully!"))
})

export {getVideoComments, addComment, updateComment, deleteComment}