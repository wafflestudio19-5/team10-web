import React from "react";
import styles from "./HeaderButton.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useTrackContext } from "../../../../context/TrackContext";

const HeaderButton = ({
  togglePlayPause,
  isSameTrack,
  buttonDisabled,
}: {
  togglePlayPause: () => void;
  isSameTrack: boolean | undefined;
  buttonDisabled: boolean;
}) => {
  const { trackIsPlaying } = useTrackContext();
  return (
    <>
      {trackIsPlaying && isSameTrack ? (
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
