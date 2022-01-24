import React from "react";
import styles from "./SetButton.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";

const SetButton = ({
  togglePlayPause,
  playing,
  buttonDisabled,
}: {
  togglePlayPause: () => void;
  playing: string;
  buttonDisabled: boolean;
}) => {
  return (
    <>
      {playing === "playing" ? (
        <button className={styles.playButton} onClick={togglePlayPause}>
          <IoMdPause />
        </button>
      ) : (
        <button
          className={buttonDisabled ? styles.noSetButton : styles.playButton}
          onClick={togglePlayPause}
          disabled={buttonDisabled}
        >
          <IoMdPlay />
        </button>
      )}
    </>
  );
};

export default SetButton;
