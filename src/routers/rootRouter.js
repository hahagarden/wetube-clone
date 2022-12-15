import express from "express";
import { getJoin, join, postJoin } from "../controllers/userController";
import { home } from "../controllers/videoController";
import { login } from "../controllers/userController";
import { search } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

export default rootRouter;
