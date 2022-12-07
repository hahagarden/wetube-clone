export const videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "1 minutes ago",
    views: 30,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 3,
    comments: 1,
    createdAt: "1 minutes ago",
    views: 5,
    id: 3,
  },
];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");
