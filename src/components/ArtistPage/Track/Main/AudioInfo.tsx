import React from "react";
import styles from "./AudioInfo.module.scss";
import { BsFillFileLock2Fill } from "react-icons/bs";

const AudioInfo = ({
  description,
  isPrivate,
}: {
  description: string;
  isPrivate: boolean;
}) => {
  return (
    <div className={styles.main}>
      {isPrivate && (
        <div className={styles.private}>
          <BsFillFileLock2Fill />
          {"  "}This track is private.
        </div>
      )}
      {description}
      {/* <button>Show more</button> */}
    </div>
  );
};

export default AudioInfo;
