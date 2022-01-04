import React, { useEffect, useState } from "react";
import styles from "./Comments.module.scss";
import { FcComments } from "react-icons/fc";
import { BsFillReplyFill } from "react-icons/bs";
import { useHistory } from "react-router";
import axios from "axios";
import { IComment } from "../TrackMain";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ITrack } from "../../TrackPage";
import { useAuthContext } from "../../../../../context/AuthContext";
dayjs.extend(relativeTime);

const Comments = ({
  comments,
  track,
  fetchComments,
}: {
  comments: IComment[];
  track: ITrack;
  fetchComments: () => void;
}) => {
  const [nestedComments, setNestedComments] = useState<IComment[]>([]);
  useEffect(() => {
    const nestComments = () => {
      const commentList = comments.map((comment) => ({ ...comment }));
      const commentMap: IComment[] = [];
      // move all the comments into a map of id => comment
      commentList.forEach((comment) => (commentMap[comment.id] = comment));
      // iterate over the comments again and correctly nest the children
      commentList.forEach((comment) => {
        if (comment.parent_comment !== null) {
          const parent = commentMap[comment.parent_comment];
          (parent.children = parent.children || []).push(comment);
        }
      });
      // filter the list to return a list of correctly nested comments
      const commentsToBeRendered = commentList.filter((comment) => {
        return comment.parent_comment === null;
      });
      setNestedComments(commentsToBeRendered);
    };
    nestComments();
  }, [comments]);

  return (
    <div className={styles.container}>
      <header>
        <FcComments />
        <span>{comments.length} comments</span>
      </header>
      <ul className={styles.commentsList}>
        {comments.length
          ? nestedComments.map((comment) => {
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
      data: { content: commentInput, parent_id: comment.id },
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
  return (
    <>
      <li key={comment.id}>
        <div className={styles.userImage} onClick={clickUsername}>
          <img src={comment.writer.image_profile} />
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
        </div>
      </li>
      {Object.prototype.hasOwnProperty.call(comment, "children") && (
        <div className={styles.replyCommentContainer}>
          {comment.children.map((child) => {
            return (
              <li key={child.id}>
                <div className={styles.userImage} onClick={clickUsername}>
                  <img src={child.writer.image_profile} />
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
