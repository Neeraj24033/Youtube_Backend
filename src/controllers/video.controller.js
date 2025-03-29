import mongoose ,{isValidObjectId} from "mongoose";
import { AsyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import { Video } from "../models/video.model.js";
import { getVideoDuration } from "../utils/ffmpeg.utils.js";
import {uploadOnCloudinary} from "../utils/cloudinary.utils.js"

const getAllVideos = AsyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = 'desc', userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    if(!req.user){
        throw new ApiError(400, "User needs to be logged in!")
    }

    const match = {
        ...(query ? {title: {$regex : query, $options: "i"}} : {}),
        ...(userId ? {owner : mongoose.Types.ObjectId(userId)} : {}),
    }

    const Videos =await Video.aggregate([
        {
            $match: match
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "videosByOwner"
            }
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                owner: {
                    $arrayElemAt: ["$videosByOwner", 0]
                }
            }
        },
        {
            $sort:{
                [sortBy] : sortType === "desc" ? -1 : 1
            }
        },
        {
            $skip: (page - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ])

    if(!Videos.length){
        throw new ApiError(404, "No videos found!")
    }

    return res.status(201)
    .json(new ApiResponse(200, Videos, "Videos fetched successfully!"))
})

const publishAVideo = AsyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(!title){
        throw new ApiError(400, "Title should not be empty!")
    }
    if(!description){
        throw new ApiError(400, "Description should not be empty!")
    }
    
    const videoFileLocalPath = req.files?.videoFile[0]?.path;
    if(!videoFileLocalPath){
        throw new ApiError(400, "Video file is required!!")
    }

    const thumbnailFileLocalPath = req.files?.thumbnail[0]?.path;
    if(!thumbnailFileLocalPath){
        throw new ApiError(400, "Thumbnail is required!!")
    }

    try {
        const duration = await getVideoDuration(videoFileLocalPath)
    
        const videoFile = await uploadOnCloudinary(videoFileLocalPath)
        if(!videoFile){
            throw new ApiError(400, "Error while uploading video to cloudinary!")
        }
    
        const thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath)
        if(!thumbnail){
            throw new ApiError(400, "Error while uploading thumbnail to cloudinary!")
        }
    
        const publishedVideo = await Video.create({
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            title,
            description,
            duration,
            videoOwner: req.user?._id
        })
    
        if(!publishedVideo){
            throw new ApiError(400, "Error while publishing the video!")
        }
    
        return res.status(201)
        .json(new ApiResponse(200, publishedVideo, "Video published successfully!"))
    } catch (error) {
        throw new ApiError(500, error)
    }
})

const getVideoById = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video ID!")
    }

    const video = await Video.findById(videoId).populate("videoOwner", "name email")

    if(!video){
        throw new ApiError(404, "Video not found!")
    }

    return res.status(201)
    .json(new ApiResponse(200, video, "Video fetched successfully!"))
})

const updateVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title, description} = req.body

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Not a valid VideoId!")
    }

    let updateData = {title, description}

    if(req.file){
        const thumbnailFileLocalPath = req.file.path

        if(!thumbnailFileLocalPath){
            throw new ApiError(404, "Thumbnail file not found!")
        }

        const thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath)

        if(!thumbnail.url){
            throw new ApiError(400, "Error while uploading thumbnail!")
        }

        updateData.thumbnail = thumbnail.url;

        const updatedVideo = await Video.findByIdAndUpdate(videoId,
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        )

        if(!updatedVideo){
            throw new ApiError(400, "Error while updating Video!")
        }

        return res.status(201)
        .json(new ApiResponse(200, updatedVideo, "Video details updated successfully!"))
    }
})

const deleteVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id!")
    }

    const deletedVIdeo = await Video.findByIdAndDelete(videoId)

    if(!deleteVideo){
        throw new ApiError(400, "Error while deleting the video!")
    }

    return res.status(201)
    .json(new ApiResponse(200, deletedVIdeo, "Video deleted successfully!"))
})

const togglePublishStatus = AsyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid VideoId!")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found!")
    }

    video.isPublished = !video.isPublished

    await video.save();

    return res.status(201)
    .json(new ApiResponse(200, video, "Publish Status toggled Successfully!"))
})

export {getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus}