// import React, { useEffect, useState } from "react";
import styles from "./Comments.module.scss";
import { FcComments } from "react-icons/fc";
import { useHistory } from "react-router";
// import axios from "axios";
import { IComment } from "./TrackMain";

const Comments = ({ comments }: { comments: IComment[] }) => {
  const history = useHistory();

  return (
    <div className={styles.container}>
      <header>
        <FcComments />
        <span>{comments.length || 0} comments</span>
      </header>
      <ul className={styles.commentsList}>
        {comments.length
          ? comments.map((comment) => {
              const clickUsername = () =>
                history.push(`/${comment.display_name}`);
              return (
                <li key={comment.id}>
                  <div className={styles.userImage} onClick={clickUsername}>
                    <div></div>
                  </div>
                  <div className={styles.mainComment}>
                    <div className={styles.commentInfo}>
                      <span
                        className={styles.hoverClick}
                        onClick={clickUsername}
                      >
                        {comment.display_name}
                      </span>{" "}
                      <span className={styles.at}>at</span>{" "}
                      <span className={styles.hoverClick}>
                        {comment.commented_at}
                      </span>
                    </div>
                    <div className={styles.comment}>{comment.content}</div>
                  </div>
                  <div className={styles.timePassed}>{comment.created_at}</div>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default Comments;
