import { AsyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = AsyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel Id!");
  }

  const subscriberId = req.user?._id;

  if (subscriberId.toString() === channelId.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel!");
  }

  const isAlreadySubscribed = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (isAlreadySubscribed) {
    await Subscription.findByIdAndDelete(isAlreadySubscribed._id);
    return res
      .status(201)
      .json(new ApiResponse(200, {}, "Unsubscribed Successfully!"));
  }

  const subscribedUser = await Subscription.create(
    {
      channel: channelId,
      subscriber: subscriberId,
    }
  );

  return res.status(201)
  .json(new ApiResponse(200, subscribedUser, "Subscribed Successfully!"))
});

const getUserChannelSubscribers = AsyncHandler(async (req, res) => {
    const channelId = req.user?._id

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Not a valid channel Id!")
    }

    const subscribersList = await Subscription.find({channel: channelId}).populate("subscriber", "_id username email");

    if(subscribersList == ""){
        throw new ApiError(404, "No subscribers found for this channel!")
    }

    return res.status(201)
    .json( new ApiResponse(200, subscribersList, "Subscribers list fetched successfully!"))
})

const getSubscribedChannels = AsyncHandler(async (req, res) => {
    const subscriberId  = req.user?._id

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Not a valid Subscriber Id!")
    }

    const subscribedChannelList = await Subscription.find({
        subscriber: subscriberId
    }).populate("channel", "_id username email")

    if(!subscribedChannelList){
        throw new ApiError(400, "You didn't subscribed to any channel!")
    }

    return res.status(201)
    .json(new ApiResponse(200, subscribedChannelList, "Subscribed Channels List fetched Successfully!"))
})

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels};
