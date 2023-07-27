// IMPORTS
import React, { useState } from "react";

// DATA
const initialData = {
  currentUser: {
    image: {
      png: "./assets/images/avatars/image-juliusomo.png",
      webp: "./assets/images/avatars/image-juliusomo.webp",
    },
    username: "juliusomo",
  },
  comments: [
    {
      id: 1,
      content:
        "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      createdAt: "1 month ago",
      score: 12,
      user: {
        image: {
          png: "./assets/images/avatars/image-amyrobson.png",
          webp: "./assets/images/avatars/image-amyrobson.webp",
        },
        username: "amyrobson",
      },
      replies: [],
    },
    {
      id: 2,
      content:
        "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      createdAt: "2 weeks ago",
      score: 5,
      user: {
        image: {
          png: "./assets/images/avatars/image-maxblagun.png",
          webp: "./assets/images/avatars/image-maxblagun.webp",
        },
        username: "maxblagun",
      },
      replies: [
        {
          id: 3,
          content:
            "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          createdAt: "1 week ago",
          score: 4,
          replyingTo: "maxblagun",
          user: {
            image: {
              png: "./assets/images/avatars/image-ramsesmiron.png",
              webp: "./assets/images/avatars/image-ramsesmiron.webp",
            },
            username: "ramsesmiron",
          },
        },
        {
          id: 4,
          content:
            "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          createdAt: "2 days ago",
          score: 2,
          replyingTo: "ramsesmiron",
          user: {
            image: {
              png: "./assets/images/avatars/image-juliusomo.png",
              webp: "./assets/images/avatars/image-juliusomo.webp",
            },
            username: "juliusomo",
          },
        },
      ],
    },
  ],
};

// APP
export default function App() {
  const [data, setData] = useState(initialData);

  // Update our data based on the new score
  function handleUpdateScore(updateScoreComment) {
    const newComments = data.comments.map((comment) =>
      comment.id === updateScoreComment.id
        ? { ...comment, score: updateScoreComment.score }
        : {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === updateScoreComment.id
                ? { ...reply, score: updateScoreComment.score }
                : { ...reply }
            ),
          }
    );

    setData((data) => {
      return { ...data, comments: newComments };
    });
  }

  // Remove comment from our data based on the id
  function handleDeleteComment(id, replying = false) {
    const newComments = replying
      ? data.comments.map((comment) => {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== id),
          };
        })
      : data.comments.filter((comment) => comment.id !== id);

    setData((data) => {
      return { ...data, comments: newComments };
    });
  }

  // Render the new comment to UI
  function handleAddComment(newComment, comment = null) {
    // Check if the comment was added today
    if (newComment.createdAt === new Date().toDateString())
      newComment.createdAt = "Today";

    setData((data) => {
      return {
        ...data,
        comments: Boolean(comment)
          ? data.comments.map((c) =>
              c.id === comment.id || c.replies.some((r) => r.id === comment.id)
                ? {
                    ...c,
                    replies: [
                      ...c.replies,
                      { ...newComment, replyingTo: comment.user.username },
                    ],
                  }
                : { ...c }
            )
          : [...data.comments, newComment],
      };
    });
  }

  return (
    <>
      <div className="app">
        <CommentList
          comments={data.comments}
          onUpdateScore={handleUpdateScore}
          onDeleteComment={handleDeleteComment}
          onAddComment={handleAddComment}
          curUser={data.currentUser}
        />
        <AddComment user={data.currentUser} onAddComment={handleAddComment} />
      </div>
      {/* <DeletePopup /> */}
      <Author />
    </>
  );
}

function CommentList({
  comments,
  curUser,
  onUpdateScore,
  onDeleteComment,
  onAddComment,
}) {
  return (
    <div className="comment-list">
      {comments.map((comment) => {
        return (
          <div
            className="comment-list--container"
            style={{ order: `-${comment.score}` }}
            key={comment.id}
          >
            <Comment
              comment={comment}
              curUser={curUser}
              onUpdateScore={onUpdateScore}
              onDeleteComment={onDeleteComment}
              onAddComment={onAddComment}
            />

            {comment.replies.length !== 0 && (
              <div className="replies comment-list">
                <div className="line"></div>
                {comment.replies.map((reply) => (
                  <Comment
                    comment={reply}
                    curUser={curUser}
                    onUpdateScore={onUpdateScore}
                    onDeleteComment={onDeleteComment}
                    onAddComment={onAddComment}
                    key={reply.id}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Comment({
  comment,
  curUser,
  onUpdateScore,
  onDeleteComment,
  onAddComment,
}) {
  const [reply, setReply] = useState(false);

  return (
    <>
      <div className="comment" style={{ order: `-${comment.score}` }}>
        <Score
          comment={comment}
          score={comment.score}
          onUpdateScore={onUpdateScore}
        />

        <div className="comment__content">
          <div className="comment__user-box">
            <img src={comment.user.image.webp} alt={comment.user.username} />

            <h1>{comment.user.username}</h1>
            {comment.user.username === "juliusomo" && (
              <p className="comment__cur-user">you</p>
            )}
            <p>{comment.createdAt}</p>

            <div className="buttons">
              {comment.user.username === "juliusomo" && (
                <button
                  className="button button-delete"
                  onClick={() =>
                    onDeleteComment(comment.id, Boolean(comment?.replyingTo))
                  }
                >
                  <svg
                    width="12"
                    height="14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                      fill="#ED6368"
                    />
                  </svg>
                  <span>Delete</span>
                </button>
              )}

              {comment.user.username === "juliusomo" ? null : (
                <button
                  className="button"
                  onClick={() => setReply((reply) => !reply)}
                >
                  <svg
                    width="14"
                    height="13"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                      fill="#5357B6"
                    />
                  </svg>
                  <span>Reply</span>
                </button>
              )}
            </div>
          </div>

          <p className="comment__message">
            {comment.replyingTo && (
              <span
                style={{
                  color: `var(--color-primary)`,
                  fontWeight: `var(--font-wg--md)`,
                }}
              >
                {`@${comment.replyingTo} `}
              </span>
            )}
            <span>{comment.content}</span>
          </p>
        </div>
      </div>

      {reply && (
        <AddComment
          user={curUser}
          comment={comment}
          reply={reply}
          onSetReply={() => setReply(false)}
          onAddComment={onAddComment}
        />
      )}
    </>
  );
}

function Score({ comment, score, onUpdateScore }) {
  const [updateScore, setUpdateScore] = useState(score);

  function handleUpdateScoreUp() {
    setUpdateScore((score) => score + 1);
    onUpdateScore({ ...comment, score: updateScore + 1 });
  }

  function handleUpdateScoreDown() {
    if (updateScore <= 0) return;

    setUpdateScore((score) => score - 1);
    onUpdateScore({ ...comment, score: updateScore - 1 });
  }

  return (
    <div className="comment__score-box">
      <button onClick={handleUpdateScoreUp}>
        <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
            fill="#C5C6EF"
          />
        </svg>
      </button>
      <p>{updateScore}</p>
      <button onClick={handleUpdateScoreDown}>
        <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
            fill="#C5C6EF"
          />
        </svg>
      </button>
    </div>
  );
}

function AddComment({ user, comment, reply, onAddComment, onSetReply }) {
  const curUser = user?.user ? user.user : user;

  const [message, setMessage] = useState("");

  function renderObject(user, curUser) {
    return {
      id: user.id ? user.id : Date.now(),
      content: message,
      createdAt: user.createdAt ? user.createdAt : new Date().toDateString(),
      score: user.score ? user.score : 0,
      replies: user.replies ? user.replies : [],
      user: {
        image: curUser.image,
        username: curUser.username,
      },
    };
  }

  function handleSubmitNewComment(e) {
    e.preventDefault();

    // Create a new comment object to lift it up
    const newComment = renderObject(user, curUser);

    // Lift the new comment up to render it to UI
    onAddComment(newComment, comment);

    // Reset the input field
    setMessage("");

    // Hide the input field
    reply && onSetReply();
  }

  return (
    <form
      className="add-comment comment"
      style={reply && { order: `-${comment.score}` }}
    >
      <img src={curUser.image.webp} alt={curUser.username} />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add comment..."
      />

      <button className="button-filled" onClick={handleSubmitNewComment}>
        {reply ? "Reply" : "Send"}
      </button>
    </form>
  );
}

// function DeletePopup() {
//   return (
//     <>
//       <div className="overlay"></div>
//       <div className="popup">
//         <h2>Delete comment</h2>
//         <p>
//           Are you sure you want to delete this comment? This will remove the
//           comment and cant be undone.
//         </p>

//         <button>No, cancel</button>
//         <button>Yes, delete</button>
//       </div>
//     </>
//   );
// }

function Author() {
  return (
    //  <!-- Author: Akram Adjab -->
    <div class="attribution">
      Challenge by
      <a
        href="https://www.frontendmentor.io?ref=challenge"
        target="_blank"
        rel="noreferrer"
        class="attribution__link"
      >
        Frontend Mentor
      </a>
      . Coded by
      <a
        href="https://www.linkedin.com/in/akram-adjab-219191230/"
        target="_blank"
        rel="noreferrer"
        class="attribution__link"
      >
        Akram Adjab
      </a>
      .
    </div>
  );
}
