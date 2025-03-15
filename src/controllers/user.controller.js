import { AsyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

const registerUser = AsyncHandler( async(req, res) => {
    // get user details from frontend
    // validation not empty
    // check if the user already exists: email, username
    // check for images, check for avatar
    // if available upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // resturn res

    const {fullName, email, username, password}= req.body
    // console.log("email: ", email)

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All field are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists!")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    if(!avatarLocalPath){
        throw ApiError(400, "Avatar is required!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw ApiError(400, "Avatar is required!")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )
})

export {registerUser}