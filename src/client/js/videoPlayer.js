const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen");
const fullscreenIcon = fullscreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoController = document.getElementById("videoController");

const { videoid } = videoContainer.dataset;
console.log(videoContainer.dataset);
let mouseMoveTimeout = null;
let userVolume = 0.5;
video.volume = userVolume;

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playIcon.classList = video.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
};
const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteIcon.classList = video.muted
    ? "fa-solid fa-volume-high"
    : "fa-solid fa-volume-xmark";
  volumeRange.value = video.muted ? 0 : userVolume;
};
const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  if (value === "0") {
    video.muted = true;
    muteBtn.innerText = "Unmute";
  }
  if (value > 0) userVolume = value;
  video.volume = userVolume;
};
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);
const handleLoadedMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};
const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};
const handleFullscreenClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullscreenIcon.classList = "fa-solid fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullscreenIcon.classList = "fa-solid fa-compress";
  }
};
const handleMouseMove = () => {
  videoController.classList.add("showing");
};
const handleMouseLeave = () => {
  videoController.classList.remove("showing");
};
const handleEnded = () => {
  fetch(`/api/videos/${videoid}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullscreenBtn.addEventListener("click", handleFullscreenClick);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
