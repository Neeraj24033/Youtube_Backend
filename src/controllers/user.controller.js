import { AsyncHandler } from "../utils/asyncHandler.utils.js";

const registerUser = AsyncHandler( async(req, res) => {
    res.status(200).json({
        message:"chai aur code"
    })
})

export {registerUser}