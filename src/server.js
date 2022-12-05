import express from "express";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
}; //middleware
app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT} 🎸`);
app.listen(PORT, handleListening);
