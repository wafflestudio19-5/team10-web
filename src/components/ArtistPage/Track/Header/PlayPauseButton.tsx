import React from "react";
import styles from "./HeaderButton.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";

const HeaderButton = ({
  isPlaying,
  togglePlayPause,
}: {
  isPlaying: boolean;
  togglePlayPause: () => void;
}) => {
  return (
    <>
      {isPlaying ? (
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
