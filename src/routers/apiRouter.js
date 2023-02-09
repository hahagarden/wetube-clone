import express from "express";
import {
  increaseView,
  postComment,
  deleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", increaseView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", postComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})/delete", deleteComment);

export default apiRouter;
