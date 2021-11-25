import React, { useState } from "react";
import styles from "./TrackHeader.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useHistory } from "react-router";

const TrackHeader = ({ openModal }: { openModal: () => void }) => {
  const [play, setPlay] = useState(false);
  const clickPlayButton = () => setPlay(!play);
  const history = useHistory();
  const username = "username";
  const tags = ["Piano", "sad piano"];
  const clickUsername = () => history.push(`/${username}`);
  const clickTag = () => history.push(`/tags/${tags[0]}`);

  return (
    <div className={styles.trackHeader}>
      <div className={styles.trackInfo}>
        <button className={styles.playButton} onClick={clickPlayButton}>
          {play ? <IoMdPause /> : <IoMdPlay />}
        </button>
        <div className={styles.soundTitle}>
          <div className={styles.titleContainer}>Title</div>
          <div className={styles.usernameContainer} onClick={clickUsername}>
            username
          </div>
        </div>
      </div>
      <div className={styles.playingTrack}></div>
      <div className={styles.titleInfo}>
        <div className={styles.releasedDate}>1 year ago</div>
        <div className={styles.tag} onClick={clickTag}>
          #{tags[0]}
        </div>
      </div>
      <div className={styles.albumImage} onClick={openModal} />
    </div>
  );
};

export default TrackHeader;
