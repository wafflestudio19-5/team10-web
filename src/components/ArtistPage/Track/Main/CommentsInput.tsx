import React from "react";
import styles from "./CommentsInput.module.scss";

const CommentsInput = () => {
  return (
    <div className={styles.main}>
      <div className={styles.commentInput}>
        <div className={styles.userImage}></div>
        <div className={styles.inputContainer}>
          <input type="text" placeholder="Write a comment" />
        </div>
      </div>
    </div>
  );
};

export default CommentsInput;
