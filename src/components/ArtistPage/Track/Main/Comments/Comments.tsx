import React, { useEffect, useRef, useState } from "react";
import styles from "./Comments.module.scss";
import { FcComments } from "react-icons/fc";
import { BsFillReplyFill } from "react-icons/bs";
import { useHistory } from "react-router";
// import axios from "axios";
import { IComment } from "../TrackMain";

const Comments = ({ comments }: { comments: IComment[] }) => {
  return (
    <div className={styles.container}>
      <header>
        <FcComments />
        <span>{comments.length || 0} comments</span>
      </header>
      <ul className={styles.commentsList}>
        {comments.length
          ? comments.map((comment) => {
              return <CommentItem comment={comment} key={comment.id} />;
            })
          : null}
      </ul>
    </div>
  );
};

const CommentItem = ({ comment }: { comment: IComment }) => {
  const [showReply, setShowReply] = useState(false);
  const [commentInput, setInput] = useState("");

  const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
  };

  const userImage = useRef<HTMLDivElement>(null);

  const user_id = "asdfhkjsd";

  useEffect(() => {
    setInput(`@${user_id}: `);
    const { current } = userImage;
    if (current !== null) {
      current.style.setProperty("--red", `${Math.floor(Math.random() * 255)}`);
      current.style.setProperty(
        "--green",
        `${Math.floor(Math.random() * 255)}`
      );
      current.style.setProperty("--blue", `${Math.floor(Math.random() * 255)}`);
      current.style.setProperty("--red2", `${Math.floor(Math.random() * 255)}`);
      current.style.setProperty(
        "--green2",
        `${Math.floor(Math.random() * 255)}`
      );
      current.style.setProperty(
        "--blue2",
        `${Math.floor(Math.random() * 255)}`
      );
    }
  }, [userImage]);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // try {
    //   const response = await axios.post(
    //     `https://api.soundwaffle.com/tracks/{tracks_id}/comments`
    //   );
    //   console.log(response);
    // } catch (error) {
    //   console.log(console.error());
    // }
    setInput(`@${user_id}: `);
    // fetchComments();
  };

  const history = useHistory();
  const clickUsername = () => history.push(`/${comment.display_name}`);
  return (
    <li key={comment.id}>
      <div className={styles.userImage} onClick={clickUsername}>
        <div ref={userImage}></div>
      </div>
      <div className={styles.mainComment}>
        <div className={styles.commentInfo}>
          <span className={styles.hoverClick} onClick={clickUsername}>
            {comment.display_name}
          </span>{" "}
          <span className={styles.at}>at</span>{" "}
          <span className={styles.hoverClick}>{comment.commented_at}</span>
        </div>
        <div className={styles.comment}>{comment.content}</div>
      </div>
      <div className={styles.timePassed}>
        <span>{comment.created_at}</span>
        <button
          className={styles.replyButton}
          onClick={() => setShowReply(true)}
        >
          <BsFillReplyFill /> Reply
        </button>
      </div>
      <div className={`${styles.replyContainer} ${showReply && styles.shown}`}>
        <div>
          <div className={styles.userImage} />
          <form className={styles.replyInput} onSubmit={onSubmit}>
            <input
              onChange={onCommentChange}
              value={commentInput}
              autoFocus
            ></input>
          </form>
        </div>
      </div>
    </li>
  );
};

export default Comments;
