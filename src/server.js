import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = (req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
}; //middleware

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/api", apiRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
