import express from "express";
import { join } from "../controllers/userController";
import { home } from "../controllers/videoController";
import { login } from "../controllers/userController";
import { search } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
