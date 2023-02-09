import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .populate("owner")
    .sort({ createdAt: "desc" });
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) return res.render("404", { pageTitle: "Video not found." });
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video)
    return res.status(404).render("404", { pageTitle: "Video not found." });
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Editing`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video)
    return res.status(404).render("404", { pageTitle: "Video not found." });
  if (String(video.owner._id) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Searching", videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Uploading" });

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    file: { path: fileUrl },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      fileUrl,
      description,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Uploading",
      errorMessage: error.message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner._id) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndRemove(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const increaseView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  console.log("done");
  return res.sendStatus(200);
};

export const postComment = async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(404);
  }
  const {
    body: { text },
    session: {
      user: { _id },
    },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const user = await User.findById(_id);
  if (!user) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: _id,
    video: id,
  });
  video.comments.push(comment._id);
  await video.save();
  user.comments.push(comment._id);
  await user.save();
  return res.status(201).json({ commentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    session: {
      user: { _id: userid },
    },
    params: { id },
  } = req;
  const comment = await Comment.findById(id)
    .populate("owner")
    .populate("video");
  const video = await Video.findById(comment.video._id);
  const owner = await User.findById(comment.owner._id);
  if (userid !== String(comment.owner._id)) {
    return res.sendStatus(404);
  }
  await Comment.findByIdAndDelete(id);
  video.comments.splice(
    video.comments.findIndex((comment) => String(comment._id) === id),
    1
  );
  await video.save();
  owner.comments.splice(
    owner.comments.findIndex((comment) => String(comment._id) === id),
    1
  );
  await owner.save();
  return res.sendStatus(200);
};
