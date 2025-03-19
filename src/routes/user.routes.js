import { Router } from "express";
import { loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateAvatar, 
    updateCoverImage, 
    getUserChannelProfile, 
    getWatchHistory 
} from "../controllers/user.controller.js";
import {Upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

const router = Router()

router.route("/register").post(
    Upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").post( verifyJWT, logoutUser)

router.route("/refreshToken").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(updateAccountDetails)

router.route("/avatar").patch(verifyJWT, Upload.single("avatar"), updateAvatar)

router.route("/cover-image").patch(verifyJWT, Upload.single("coverImage"), updateCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("watch-history").get(verifyJWT, getWatchHistory)

export default router;