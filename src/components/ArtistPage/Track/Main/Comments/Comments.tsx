import React, { useState } from "react";
import styles from "./Comments.module.scss";
import { FcComments } from "react-icons/fc";
import { BsFillReplyFill, BsTrashFill } from "react-icons/bs";
import { useHistory } from "react-router";
import axios from "axios";
import { IComment } from "../TrackMain";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { ITrack, IUserMe } from "../../TrackPage";
import { useAuthContext } from "../../../../../context/AuthContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Comments = ({
  comments,
  track,
  fetchComments,
  userMe,
  commentCount,
  isFinalComment,
}: {
  comments: IComment[];
  track: ITrack;
  fetchComments: () => void;
  userMe: IUserMe;
  commentCount: number;
  isFinalComment: boolean;
}) => {
  console.log(comments);
  const sortedComments = comments.reduce((sorted: any, comment: IComment) => {
    if (!sorted[comment.group]) {
      sorted[comment.group] = [];
    }
    sorted[comment.group].push(comment);
    return sorted;
  }, []);
  return (
    <div
      className={`${styles.container} ${isFinalComment && styles.bottomBorder}`}
    >
      <header>
        <FcComments />
        <span>{commentCount} comments</span>
      </header>
      <ul className={styles.commentsList}>
        {comments.length !== 0
          ? sortedComments.reverse().map((comment: IComment[]) => {
              return (
                <CommentItem
                  comments={comment}
                  key={comment[0].group}
                  track={track}
                  fetchComments={fetchComments}
                  userMe={userMe}
                />
              );
            })
          : null}
      </ul>
    </div>
  );
};

const CommentItem = ({
  comments,
  track,
  fetchComments,
  userMe,
}: {
  comments: IComment[];
  track: ITrack;
  fetchComments: () => void;
  userMe: IUserMe;
}) => {
  const [showReply, setShowReply] = useState(false);
  const [commentInput, setInput] = useState("");

  const { userSecret } = useAuthContext();

  const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const config: any = {
      method: "post",
      url: `/tracks/${track.id}/comments`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {
        content: commentInput,
        group: comments[0].group,
      },
    };
    try {
      const response = await axios(config);
      console.log(response);
      fetchComments();
    } catch (error) {
      console.log(console.error());
    }
    setInput("");
    setShowReply(false);
    fetchComments();
  };

  const history = useHistory();
  const clickUsername = (permalink: string) => {
    return history.push(`/${permalink}`);
  };

  //   const commentedTime = (comment: IComment) => {
  //     return comment.created_at.slice(11, 16);
  //   };
  const commentedFromNow = (comment: IComment) => {
    return dayjs(comment.created_at).fromNow();
  };

  const deleteComment = async (id: number) => {
    confirmAlert({
      message: "Do you really want to remove this comment?",
      buttons: [
        {
          label: "Cancel",
          onClick: () => {
            return null;
          },
        },
        {
          label: "Yes",
          onClick: async () => {
            const config: any = {
              method: "delete",
              url: `/tracks/${track.id}/comments/${id}`,
              headers: {
                Authorization: `JWT ${userSecret.jwt}`,
              },
              data: {},
            };
            try {
              const response = await axios(config);
              if (response) {
                console.log("deleted");
                fetchComments();
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    });
  };

  return (
    <>
      <li key={comments[0].id}>
        <div
          className={styles.userImage}
          onClick={() => clickUsername(comments[0].writer.permalink)}
        >
          <img
            src={comments[0].writer.image_profile || "/default_user_image.png"}
            alt={`${comments[0].writer.display_name}의 프로필 사진`}
          />
        </div>
        <div className={styles.mainComment}>
          <div className={styles.commentInfo}>
            <span
              className={styles.hoverClick}
              onClick={() => clickUsername(comments[0].writer.permalink)}
            >
              {comments[0].writer.id === userSecret.id
                ? "You"
                : comments[0].writer.display_name}
            </span>
            {/* <span className={styles.at}>at</span>{" "}
            <span className={styles.hoverClick}>{commentedTime(comment)}</span> */}
          </div>
          <div className={styles.comment}>{comments[0].content}</div>
        </div>
        <div className={styles.timePassed}>
          <span>{commentedFromNow(comments[0])}</span>
          <button
            className={styles.replyButton}
            onClick={() => setShowReply(true)}
          >
            <BsFillReplyFill /> Reply
          </button>
          {comments[0].writer.permalink === userSecret.permalink && (
            <button
              className={styles.deleteButton}
              onClick={() => deleteComment(comments[0].id)}
            >
              <BsTrashFill />
            </button>
          )}
        </div>
      </li>
      {comments.length > 1 && (
        <div className={styles.replyCommentContainer}>
          {comments.slice(1).map((child) => {
            return (
              <li key={child.id}>
                <div
                  className={styles.userImage}
                  onClick={() => clickUsername(child.writer.permalink)}
                >
                  <img
                    src={
                      child.writer.image_profile || "/default_user_image.png"
                    }
                    alt={`${child.writer.display_name}의 프로필 사진`}
                  />
                </div>
                <div className={styles.mainComment}>
                  <div className={styles.commentInfo}>
                    <span
                      className={styles.hoverClick}
                      onClick={() => clickUsername(child.writer.permalink)}
                    >
                      {child.writer.id === userSecret.id
                        ? "You"
                        : child.writer.display_name}
                    </span>
                    {/* <span className={styles.at}>at</span>{" "}
                    <span className={styles.hoverClick}>
                      {commentedTime(child)}
                    </span> */}
                  </div>
                  <div className={styles.comment}>{child.content}</div>
                </div>
                <div className={styles.timePassed}>
                  <span>{commentedFromNow(child)}</span>
                  <button
                    className={styles.replyButton}
                    onClick={() => setShowReply(true)}
                  >
                    <BsFillReplyFill /> Reply
                  </button>
                  {child.writer.permalink === userSecret.permalink && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteComment(child.id)}
                    >
                      <BsTrashFill />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </div>
      )}
      <div className={`${styles.replyContainer} ${showReply && styles.shown}`}>
        <div>
          <img
            className={styles.replyUserImage}
            src={userMe.image_profile || "/default_user_image.png"}
          />
          <form className={styles.replyInput} onSubmit={onSubmit}>
            <input
              onChange={onCommentChange}
              value={commentInput}
              autoFocus
            ></input>
          </form>
        </div>
      </div>
    </>
  );
};

export default Comments;
