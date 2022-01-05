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
import { ITrack } from "../../TrackPage";
import { useAuthContext } from "../../../../../context/AuthContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Comments = ({
  comments,
  track,
  fetchComments,
}: {
  comments: IComment[];
  track: ITrack;
  fetchComments: () => void;
}) => {
  return (
    <div className={styles.container}>
      <header>
        <FcComments />
        <span>{track.comment_count} comments</span>
      </header>
      <ul className={styles.commentsList}>
        {comments.length !== 0
          ? comments.reverse().map((comment) => {
              return (
                <CommentItem
                  comment={comment}
                  key={comment.id}
                  track={track}
                  fetchComments={fetchComments}
                />
              );
            })
          : null}
      </ul>
    </div>
  );
};

const CommentItem = ({
  comment,
  track,
  fetchComments,
}: {
  comment: IComment;
  track: ITrack;
  fetchComments: () => void;
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
        parent_id: comment.children[comment.children.length - 1].id,
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
  const clickUsername = () => history.push(`/${comment.writer.permalink}`);

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
                fetchComments();
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    });
    return;
  };

  return (
    <>
      <li key={comment.id}>
        <div className={styles.userImage} onClick={clickUsername}>
          <img
            src={comment.writer.image_profile}
            alt={`${comment.writer.first_name} ${comment.writer.last_name}의 프로필 사진`}
          />
        </div>
        <div className={styles.mainComment}>
          <div className={styles.commentInfo}>
            <span className={styles.hoverClick} onClick={clickUsername}>
              {comment.writer.permalink}
            </span>{" "}
            {/* <span className={styles.at}>at</span>{" "}
            <span className={styles.hoverClick}>{commentedTime(comment)}</span> */}
          </div>
          <div className={styles.comment}>{comment.content}</div>
        </div>
        <div className={styles.timePassed}>
          <span>{commentedFromNow(comment)}</span>
          <button
            className={styles.replyButton}
            onClick={() => setShowReply(true)}
          >
            <BsFillReplyFill /> Reply
          </button>
          {comment.writer.permalink === userSecret.permalink && (
            <button
              className={styles.deleteButton}
              onClick={() => deleteComment(comment.id)}
            >
              <BsTrashFill />
            </button>
          )}
        </div>
      </li>
      {Object.prototype.hasOwnProperty.call(comment, "children") && (
        <div className={styles.replyCommentContainer}>
          {comment.children.map((child) => {
            return (
              <li key={child.id}>
                <div className={styles.userImage} onClick={clickUsername}>
                  <img
                    src={child.writer.image_profile}
                    alt={`${child.writer.first_name} ${child.writer.last_name}의 프로필 사진`}
                  />
                </div>
                <div className={styles.mainComment}>
                  <div className={styles.commentInfo}>
                    <span className={styles.hoverClick} onClick={clickUsername}>
                      {child.writer.permalink}
                    </span>{" "}
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
          <div className={styles.replyUserImage} />
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
