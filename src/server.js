import express from "express";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

const logger = (req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
}; //middleware
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
