import React from "react";
import styles from "./TrackHeader.module.scss";

const TrackHeader = () => {
  return (
    <div className={styles.trackHeader}>
      <div className={styles.trackInfo}>
        <button className={styles.playButton}></button>
        <div className={styles.soundTitle}>
          <div className={styles.titleContainer}>Title</div>
          <div className={styles.usernameContainer}>username</div>
        </div>
      </div>
      <div className={styles.titleInfo}>
        <div className={styles.releasedDate}>1 year ago</div>
        <div className={styles.tag}>#Piano</div>
      </div>
      <div className={styles.albumImage} />
    </div>
  );
};

export default TrackHeader;
