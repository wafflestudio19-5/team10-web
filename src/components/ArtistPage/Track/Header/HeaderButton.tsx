import React from "react";
import styles from "./HeaderButton.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";

const HeaderButton = ({
  isPlaying,
  togglePlayPause,
  isSameTrack,
  noTrack,
}: {
  isPlaying: boolean;
  togglePlayPause: () => void;
  isSameTrack: boolean;
  noTrack: boolean;
}) => {
  return (
    <>
      {isPlaying && isSameTrack ? (
        <button className={styles.playButton} onClick={togglePlayPause}>
          <IoMdPause />
        </button>
      ) : (
        <button
          className={noTrack ? styles.noTrackButton : styles.playButton}
          onClick={togglePlayPause}
          disabled={noTrack}
        >
          <IoMdPlay />
        </button>
      )}
    </>
  );
};

export default HeaderButton;
