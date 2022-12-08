import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  deleteVideo,
  postUpload,
  getUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", getUpload);
videoRouter.post("/upload", postUpload);

export default videoRouter;
