const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const textarea = commentForm.querySelector("textarea");

const renderComment = (text) => {
  const ul = document.querySelector("#commentContainer ul");
  const li = document.createElement("li");
  const commentIcon = document.createElement("i");
  commentIcon.classList = "fa-regular fa-comment";
  li.appendChild(commentIcon);
  const commentSpan = document.createElement("span");
  commentSpan.innerText = ` ${text.trim()}`;
  li.appendChild(commentSpan);
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = " ❌";
  li.appendChild(deleteSpan);
  ul.appendChild(li);
};

const handleCommentSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  if (text === "") {
    return;
  }
  const { videoid } = videoContainer.dataset;
  await fetch(`/api/videos/${videoid}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  renderComment(text);
};

commentForm.addEventListener("submit", handleCommentSubmit);
