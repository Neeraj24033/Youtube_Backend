import { ApiResponse } from "../utils/apiResponse.utils.js";
import { AsyncHandler } from "../utils/asyncHandler.utils.js";

const healthCheck = AsyncHandler( async(req, res) => {
    return res.status(201)
    .json(new ApiResponse(200, {status: "Ok"}, "Everything works well!"))
})

export{healthCheck}