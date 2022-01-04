// import axios from "axios";
import React, { useState } from "react";
import styles from "./CommentsInput.module.scss";
import axios from "axios";
import { ITrack } from "../../TrackPage";
import { useAuthContext } from "../../../../../context/AuthContext";

const CommentsInput = ({
  fetchComments,
  track,
}: {
  fetchComments: () => void;
  track: ITrack;
}) => {
  const [commentInput, setInput] = useState("");
  const { userSecret } = useAuthContext();
  const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/tracks/${track.id}/comments`, {
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        content: commentInput,
      });
      console.log(response);
    } catch (error) {
      console.log(console.error());
    }
    setInput("");
    fetchComments();
  };

  return (
    <div className={styles.main}>
      <div className={styles.commentInput}>
        <div className={styles.userImage}></div>
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
