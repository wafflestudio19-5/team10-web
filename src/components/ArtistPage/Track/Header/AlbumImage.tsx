import React from "react";
import { ITrack } from "../TrackPage";
import styles from "./AlbumImage.module.scss";

const AlbumImage = ({
  openModal,
  track,
}: {
  openModal: () => void;
  track: ITrack;
}) => {
  return (
    <div className={styles.albumImage} onClick={openModal}>
      {track.image ? (
        <img src={track.image} alt={`${track.title}의 트랙 이미지`} />
      ) : null}
    </div>
  );
};

export default AlbumImage;
