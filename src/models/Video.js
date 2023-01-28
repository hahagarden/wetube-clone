import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  fileUrl: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) =>
      word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`
    );
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
