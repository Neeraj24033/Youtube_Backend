// Using async await
    const AsyncHandler = (func) => async (req, res, next) => {      //next is compulsory in this case because we will have to use middleware.
        try {
            await func(req, res, next)
        } catch (error) {
            res.status(err.code || 500).json({          //to handle async function we use this async handler.
                success: false,
                message: err.message
            })
        }
    }



export {AsyncHandler}

// Using promise
    // const AsyncHandler = (requestHandler) =>  {
    //     (req, res, next) => {
    //         Promise
    //         .resolve(requestHandler(req, res, next))
    //         .catch((err) => next(err))
    //     }
    // }

