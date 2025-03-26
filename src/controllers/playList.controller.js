import mongoose, {isValidObjectId} from "mongoose";
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

    const playList = await PlayList.create({
        name,
        description,
        owner: req.user._id
    })

    const createdPlayList = await PlayList.findById(playList._id)

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

    const playList = await PlayList.findById({_id:playlistId})      //populate videos here after making video schema

    if(!playList){
        throw new ApiError(404, "Playlist not found!")
    }

    console.log(playList)
    return res.status(201)
    .json( new ApiResponse(200, playList, "Playlist fetched successfully!"))
})

const updatePlaylist = AsyncHandler( async( req, res ) => {
    const { playlistId, videoId } = req.params;

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(404, "Invalid playlist or video ID's!")
    }

    const playList = await PlayList.findById(playlistId)

    if(!playList){
        throw new ApiError(404, "Playlist not found!")
    }

    if(playList.video.includes(videoId)){
        throw new ApiError(400, "Video is already in the playlist!")
    }

    const updatedPlaylist = await playList.video.push(videoId)

    return res.status(201)
    .json(new ApiResponse(200, updatePlaylist, "Video Added successfully!"))
})

export {createPlaylist, getUserPlaylists, getPlaylistById, updatePlaylist}