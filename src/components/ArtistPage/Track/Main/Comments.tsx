import React from "react";
import styles from "./Comments.module.scss";
import { FcComments } from "react-icons/fc";

interface Comment {
  id: number;
  username: string;
  writtenTime: string;
  comment: string;
  timePassed: string;
}
const Comments = () => {
  const comments: Comment[] = [
    {
      id: 1,
      username: "누구게",
      writtenTime: "0:14",
      comment: "ㄴ아ㅓ롬ㅇ로",
      timePassed: "1 day ago",
    },
    {
      id: 2,
      username: "누구게",
      writtenTime: "0:14",
      comment: "ㅁㄴ아ㅓ로마어리마오ㅓㄹ",
      timePassed: "2 day ago",
    },
    {
      id: 3,
      username: "누구게",
      writtenTime: "0:14",
      comment: "농라ㅓㄴㅁ오리마ㅓ오리ㅓ",
      timePassed: "3 day ago",
    },
    {
      id: 4,
      username: "누구게",
      writtenTime: "0:14",
      comment: "ㄹ노임어ㅏㄹㅁ어ㅏ리망러",
      timePassed: "4 day ago",
    },
  ];

  return (
    <div className={styles.container}>
      <header>
        <FcComments />
        <span>{comments.length || 0} comments</span>
      </header>
      <ul className={styles.commentsList}>
        {comments.length
          ? comments.map((comment) => {
              return (
                <li key={comment.id}>
                  <div className={styles.userImage}>
                    <div></div>
                  </div>
                  <div className={styles.mainComment}>
                    <div className={styles.commentInfo}>
                      {comment.username} <span>at</span> {comment.writtenTime}
                    </div>
                    <div className={styles.comment}>{comment.comment}</div>
                  </div>
                  <div className={styles.timePassed}>{comment.timePassed}</div>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default Comments;
