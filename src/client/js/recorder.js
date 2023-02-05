const recordBtn = document.getElementById("record");
const video = document.getElementById("videoStream");

let stream;
let recorder;
let videoFile;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};
const handleDownloadClick = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "myRecord.webm";
  document.body.appendChild(a);
  a.click();
};
const handleStopRecordingClick = () => {
  recordBtn.innerText = "Download Video";
  recordBtn.removeEventListener("click", handleStopRecordingClick);
  recordBtn.addEventListener("click", handleDownloadClick);
  recorder.stop();
};
const handleStartRecordingClick = async () => {
  recordBtn.innerText = "Stop Recording";
  recordBtn.removeEventListener("click", handleStartRecordingClick);
  recordBtn.addEventListener("click", handleStopRecordingClick);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

init();
recordBtn.addEventListener("click", handleStartRecordingClick);
