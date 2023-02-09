const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const textarea = commentForm.querySelector("textarea");
const deleteComment = document.getElementById("deleteComment");
const commentsUl = document.querySelector("#commentContainer ul");

const renderDeleteComment = (id) => {
  const deletingLi = document.querySelector(`[data-commentid="${id}"]`);
  commentsUl.removeChild(deletingLi);
};

const handleDeleteCommentClick = async (event) => {
  const { commentid } = event.target.parentElement.dataset;
  await fetch(`/api/comments/${commentid}/delete`, { method: "DELETE" });
  renderDeleteComment(commentid);
};

const renderComment = (text, id) => {
  const appendingLi = document.createElement("li");
  appendingLi.classList = "video__comment";
  appendingLi.dataset.commentid = id;
  const commentIcon = document.createElement("i");
  commentIcon.classList = "fa-regular fa-comment";
  appendingLi.appendChild(commentIcon);
  const commentSpan = document.createElement("span");
  commentSpan.innerText = ` ${text.trim()}`;
  appendingLi.appendChild(commentSpan);
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = " ❌";
  deleteSpan.addEventListener("click", handleDeleteCommentClick);
  appendingLi.appendChild(deleteSpan);
  commentsUl.appendChild(appendingLi);
};

const handleCommentSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  if (text === "") {
    return;
  }
  const { videoid } = videoContainer.dataset;
  const response = await fetch(`/api/videos/${videoid}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { commentId } = await response.json();
    textarea.value = "";
    renderComment(text, commentId);
  }
};

commentForm.addEventListener("submit", handleCommentSubmit);
if (deleteComment)
  deleteComment.addEventListener("click", handleDeleteCommentClick);
