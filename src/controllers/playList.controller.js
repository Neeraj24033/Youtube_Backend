import mongoose, {isValidObjectId, Mongoose} from "mongoose";
import { AsyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { PlayList } from "../models/playList.model.js";

const createPlaylist = AsyncHandler( async(req, res) => {
    const {name, description} = req.body

    if(!name || !description){
        throw new ApiError(400, "Name and description both are required!")
    }

    const existedPlayList = await PlayList.findOne({name})

    if(existedPlayList){
        throw new ApiError(401, "PlayList with this name already exists!")
    }

    const createdPlayList = await PlayList.create({
        name,
        description,
        owner: req.user._id
    })

    if(!createdPlayList) {
        throw new ApiError(500, "Something went wrong while creating PlayList!")
    }

    return res.status(201)
    .json(new ApiResponse(200, createdPlayList, "PlayList created successfully!"))
})

const getUserPlaylists = AsyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User Id!")
    }

    const userPlayLists =await PlayList.find({owner: userId})

    if(!userPlayLists || userPlayLists.length === "") {
        throw new ApiError(404, "Playlists not found!")
    }

    return res.status(201)
    .json(new ApiResponse(200, userPlayLists, "Playlists fetched successfully!"))
})

const getPlaylistById = AsyncHandler( async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id!")
    }

    const playList = await PlayList.findById({_id:playlistId}).populate("video")      //populate videos here after making video schema

    if(!playList){
        throw new ApiError(404, "Playlist not found!")
    }

    return res.status(201)
    .json( new ApiResponse(200, playList, "Playlist fetched successfully!"))
})

const addVideoToPlaylist = AsyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Not a valid PlayList or Video Id!")
    }

    const updatedPlaylist = await PlayList.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $addFields: {
                video: {
                    $setUnion: ["$video",[new mongoose.Types.ObjectId(videoId)]]
                }
            }
        },
        {
            $merge: {
                into: "playlists"
            }
        }
    ])

    if(!updatedPlaylist){
        throw new ApiError(404, "PlayList not found or video added already!")
    }

    return res.status(201)
    .json(new ApiResponse(200, updatedPlaylist, "Video added successfully!"))
})

const removeVideoFromPlaylist = AsyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Not a valid PlayList or Video Id!")
    }

    const updatedPlaylist = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            new: true
        }
    ) 

    if(!updatedPlaylist){
        throw new ApiError(400, "Error while removing the video from Playlist!")
    }

    return res.status(201)
    .json(new ApiResponse(200, updatedPlaylist, "Video removed successfully!"))

})

const deletePlaylist = AsyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Not a valid Playlist Id!")
    }

    const deletedPlaylist = await PlayList.findByIdAndDelete(playlistId)

    if(!deletedPlaylist){
        throw new ApiError(404, "Playlist not found!")
    }

    return res.status(201)
    .json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully!"))
})

const updatePlaylist = AsyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Not a valid playlist Id!")
    }

    if(!name || !description){
        throw new ApiError(400, "Name or description cannot be empty!")
    }

    const updatedPlaylist = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    )

    if(!updatedPlaylist){
        throw new ApiError(400, "Error while updating the playlist!")
    }

    return res.status(201)
    .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully!"))
})

export {createPlaylist, getUserPlaylists, getPlaylistById, updatePlaylist, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist}