import mongoose from "mongoose";

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wetube", {});

const db = mongoose.connection; //mongoose가 우리 서버와 데이터베이스 서버를 연결시켜주는 역할을 함.

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
