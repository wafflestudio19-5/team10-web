import React from "react";
import styles from "./AudioInfo.module.scss";

const AudioInfo = ({ description }: { description: string }) => {
  return (
    <div className={styles.main}>
      {description}
      {/* <button>Show more</button> */}
    </div>
  );
};

export default AudioInfo;
