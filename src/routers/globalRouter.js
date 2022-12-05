import express from "express";
import { join } from "../controllers/userController";
import { trending } from "../controllers/videoController";
import { login } from "../controllers/userController";
import { search } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
