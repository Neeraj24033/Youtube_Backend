import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { AsyncHandler } from "../utils/asyncHandler.utils.js";
import Jwt from "jsonwebtoken";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Beare ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Request!")
        }
    
        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access token!")
    }
})