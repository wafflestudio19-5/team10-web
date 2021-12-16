// import React, { useEffect, useState } from "react";
import styles from "./Comments.module.scss";
import { FcComments } from "react-icons/fc";
import { useHistory } from "react-router";
// import axios from "axios";

interface IComment {
  id: number;
  display_name: string;
  commented_at: string;
  content: string;
  created_at: string;
}
const Comments = () => {
  //   const [comments, setComments] = useState<IComment[]>([
  //     {
  //       id: 1,
  //       display_name: "김와플",
  //       commented_at: "0:14",
  //       content: "댓글",
  //       created_at: "1 day ago",
  //     },
  //     {
  //       id: 2,
  //       display_name: "박와플",
  //       commented_at: "0:14",
  //       content: "댓글",
  //       created_at: "2 day ago",
  //     },
  //     {
  //       id: 3,
  //       display_name: "이와플",
  //       commented_at: "0:14",
  //       content: "댓글",
  //       created_at: "3 day ago",
  //     },
  //     {
  //       id: 4,
  //       display_name: "김김김",
  //       commented_at: "0:14",
  //       content: "댓글",
  //       created_at: "4 day ago",
  //     },
  //   ]);
  const comments: IComment[] = [
    {
      id: 1,
      display_name: "김와플",
      commented_at: "0:14",
      content: "댓글",
      created_at: "1 day ago",
    },
    {
      id: 2,
      display_name: "박와플",
      commented_at: "0:14",
      content: "댓글",
      created_at: "2 day ago",
    },
    {
      id: 3,
      display_name: "이와플",
      commented_at: "0:14",
      content: "댓글",
      created_at: "3 day ago",
    },
    {
      id: 4,
      display_name: "김김김",
      commented_at: "0:14",
      content: "댓글",
      created_at: "4 day ago",
    },
  ];
  const history = useHistory();

  //   useEffect(() => {
  //     const fetchComments = async () => {
  //       try {
  //         const response = await axios.get(
  //           `https://api.soundwaffle.com/tracks/{track_id}/comments`
  //         );
  //         const data = response.data;
  //         setComments(data);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     fetchComments();
  //   });

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
