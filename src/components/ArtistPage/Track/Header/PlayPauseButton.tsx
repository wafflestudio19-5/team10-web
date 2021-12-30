import React from "react";
import styles from "./HeaderButton.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";

const HeaderButton = ({
  isPlaying,
  togglePlayPause,
  isSameTrack,
}: {
  isPlaying: boolean;
  togglePlayPause: () => void;
  isSameTrack: boolean;
}) => {
  return (
    <>
      {isPlaying && isSameTrack ? (
        <button className={styles.playButton} onClick={togglePlayPause}>
          <IoMdPause />
        </button>
      ) : (
        <button className={styles.playButton} onClick={togglePlayPause}>
          <IoMdPlay />
        </button>
      )}
    </>
  );
};

export default HeaderButton;
