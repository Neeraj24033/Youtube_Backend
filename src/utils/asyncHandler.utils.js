const AsyncHandler = (requestHandler) =>  {
    (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}

export {AsyncHandler}


// Using async await
    // const asyncHandler = (func) => async (req, res, next) => {      //next is compulsory in this case because we will have to use middleware.
    //     try {
    //         await func(req, res, next)
    //     } catch (error) {
    //         res.status(err.code || 500).json({
    //             success: false,
    //             message: err.message
    //         })
    //     }
    // }