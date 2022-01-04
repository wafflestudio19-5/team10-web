import React, { useState } from "react";
import styles from "./Comments.module.scss";
import { FcComments } from "react-icons/fc";
import { BsFillReplyFill } from "react-icons/bs";
import { useHistory } from "react-router";
// import axios from "axios";
import { IComment } from "../TrackMain";
import { ITrack } from "../../TrackPage";

const Comments = ({
  comments,
  track,
}: {
  comments: IComment[];
  track: ITrack;
}) => {
  return (
    <div className={styles.container}>
      <header>
        <FcComments />
        <span>{track.comment_count} comments</span>
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
    // fetchComments();
  };

  const history = useHistory();
  const clickUsername = () => history.push(`/${comment.writer.permalink}`);

  const commentedTime = comment.created_at.slice(11, 16);
  return (
    <li key={comment.id}>
      <div className={styles.userImage} onClick={clickUsername}>
        <div></div>
      </div>
      <div className={styles.mainComment}>
        <div className={styles.commentInfo}>
          <span className={styles.hoverClick} onClick={clickUsername}>
            {comment.writer.permalink}
          </span>{" "}
          <span className={styles.at}>at</span>{" "}
          <span className={styles.hoverClick}>{commentedTime}</span>
        </div>
        <div className={styles.comment}>{comment.content}</div>
      </div>
      <div className={styles.timePassed}>
        <span>{comment.commented_at}</span>
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
