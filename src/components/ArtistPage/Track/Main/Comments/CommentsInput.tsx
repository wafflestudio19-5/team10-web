// import axios from "axios";
import React, { useState } from "react";
import styles from "./CommentsInput.module.scss";
import axios from "axios";
import { ITrack, IUserMe } from "../../TrackPage";
import { useAuthContext } from "../../../../../context/AuthContext";
import { throttle } from "lodash";

const CommentsInput = ({
  fetchComments,
  track,
  userMe,
}: {
  fetchComments: () => void;
  track: ITrack;
  userMe: IUserMe;
}) => {
  const [commentInput, setInput] = useState("");
  const { userSecret } = useAuthContext();
  const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (commentInput.trim().length === 0) {
      return;
    }
    const submitInput = throttle(async () => {
      const config: any = {
        method: "post",
        url: `/tracks/${track.id}/comments`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: { content: commentInput },
      };
      try {
        const response = await axios(config);
        console.log(response);
      } catch (error) {
        console.log(console.error());
      }
    }, 1000);
    submitInput();
    setInput("");
    setTimeout(() => fetchComments(), 100);
  };

  return (
    <div className={styles.main}>
      <div className={styles.commentInput}>
        <img
          src={userMe.image_profile || "/default_user_image.png"}
          className={styles.userImage}
        />
        <form className={styles.inputContainer} onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Write a comment"
            value={commentInput}
            onChange={onCommentChange}
          />
        </form>
      </div>
    </div>
  );
};

export default CommentsInput;
