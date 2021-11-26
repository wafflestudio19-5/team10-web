import React from "react";
import styles from "./Comments.module.scss";
import { FcComments } from "react-icons/fc";
import { useHistory } from "react-router";

interface Comment {
  id: number;
  display_name: string;
  commented_at: string;
  comment: string;
  created_at: string;
}
const Comments = () => {
  const comments: Comment[] = [
    {
      id: 1,
      display_name: "누구게",
      commented_at: "0:14",
      comment: "ㄴ아ㅓ롬ㅇ로",
      created_at: "1 day ago",
    },
    {
      id: 2,
      display_name: "누구게",
      commented_at: "0:14",
      comment: "ㅁㄴ아ㅓ로마어리마오ㅓㄹ",
      created_at: "2 day ago",
    },
    {
      id: 3,
      display_name: "누구게",
      commented_at: "0:14",
      comment: "농라ㅓㄴㅁ오리마ㅓ오리ㅓ",
      created_at: "3 day ago",
    },
    {
      id: 4,
      display_name: "누구게",
      commented_at: "0:14",
      comment: "ㄹ노임어ㅏㄹㅁ어ㅏ리망러",
      created_at: "4 day ago",
    },
  ];
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
                    <div className={styles.comment}>{comment.comment}</div>
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
