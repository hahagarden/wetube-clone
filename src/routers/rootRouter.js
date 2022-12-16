import express from "express";
import { getJoin, join, postJoin } from "../controllers/userController";
import { home } from "../controllers/videoController";
import { getLogin, postLogin } from "../controllers/userController";
import { search } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
