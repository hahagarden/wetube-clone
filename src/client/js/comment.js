const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const textarea = commentForm.querySelector("textarea");
const deleteCommentBtns = document.querySelectorAll("span.comment__delete");
const commentsUl = document.querySelector("ul.video__comments");

const renderDeleteComment = (id) => {
  const deletingLi = document.querySelector(`[data-commentid="${id}"]`);
  commentsUl.removeChild(deletingLi);
};

const handleDeleteCommentClick = async (event) => {
  const { commentid } = event.target.parentElement.dataset;
  await fetch(`/api/comments/${commentid}/delete`, { method: "DELETE" });
  renderDeleteComment(commentid);
};

const renderComment = (text, id, createdAt, owner) => {
  const appendingLi = document.createElement("li");
  appendingLi.classList = "video__comment";
  appendingLi.dataset.commentid = id;
  const commentIcon = document.createElement("i");
  commentIcon.classList = "fa-regular fa-comment";
  appendingLi.appendChild(commentIcon);
  const commentSpan = document.createElement("span");
  commentSpan.innerText = ` ${text.trim()}`;
  appendingLi.appendChild(commentSpan);
  const commentOwnerSpan = document.createElement("span");
  commentOwnerSpan.innerText = ` ${owner}`;
  commentOwnerSpan.classList = "comment__owner";
  appendingLi.appendChild(commentOwnerSpan);
  const commentTimeSpan = document.createElement("span");
  const iso = new Date(createdAt);
  commentTimeSpan.innerText = ` ${iso.toString()}`;
  commentTimeSpan.classList = "comment__time";
  appendingLi.appendChild(commentTimeSpan);
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = " ❌";
  deleteSpan.addEventListener("click", handleDeleteCommentClick);
  appendingLi.appendChild(deleteSpan);
  commentsUl.prepend(appendingLi);
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
    const { commentId, commentCreatedAt, commentOwner } = await response.json();
    textarea.value = "";
    renderComment(text, commentId, commentCreatedAt, commentOwner);
  }
};

commentForm.addEventListener("submit", handleCommentSubmit);
if (deleteCommentBtns)
  deleteCommentBtns.forEach((btn) =>
    btn.addEventListener("click", handleDeleteCommentClick)
  );
