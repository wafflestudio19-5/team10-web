import React from "react";
import styles from "./HeaderButton.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";

const HeaderButton = ({
  isPlaying,
  togglePlayPause,
  isSameTrack,
  buttonDisabled,
}: {
  isPlaying: boolean;
  togglePlayPause: () => void;
  isSameTrack: boolean | undefined;
  buttonDisabled: boolean;
}) => {
  return (
    <>
      {isPlaying && isSameTrack ? (
        <button className={styles.playButton} onClick={togglePlayPause}>
          <IoMdPause />
        </button>
      ) : (
        <button
          className={buttonDisabled ? styles.noTrackButton : styles.playButton}
          onClick={togglePlayPause}
          disabled={buttonDisabled}
        >
          <IoMdPlay />
        </button>
      )}
    </>
  );
};

export default HeaderButton;
