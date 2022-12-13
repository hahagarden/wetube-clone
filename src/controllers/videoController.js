import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};
export const search = (req, res) => res.send("Search");
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Uploading" });
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const video = new Video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  await video.save(); //db에 저장함
  return res.redirect("/");
};
export const deleteVideo = (req, res) => res.send("Delete Video");
