import { Router } from "express";
import { getAllVideos } from "../controllers/video.controller.js";

const router = Router();

router.route("/getAllVideos").get(getAllVideos)

export default router;