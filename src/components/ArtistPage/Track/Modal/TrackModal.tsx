import React from "react";
import styles from "./TrackModal.module.scss";
import { GrClose } from "react-icons/gr";
import { IArtist, ITrack } from "../TrackPage";

const TrackModal = ({
  modal,
  closeModal,
  track,
  artist,
}: {
  modal: boolean;
  closeModal: () => void;
  track: ITrack;
  artist: IArtist;
}) => {
  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_track_image.svg";
  };
  return (
    <div
      className={`${styles["modal"]} ${
        modal ? styles["openModal"] : styles["closedModal"]
      }`}
      onClick={closeModal}
    >
      <div className={styles.closeButton} onClick={closeModal}>
        <GrClose />
      </div>
      {modal && (
        <section onClick={(event) => event.stopPropagation()}>
          <main>
            <div className={styles.trackInfo}>
              {track.title} - {artist.display_name}
            </div>
            <div className={styles.trackImage}>
              <img
                src={track.image || "/default_track_image.svg"}
                onError={onImageError}
                alt={`${track.title}의 트랙 이미지`}
              />
              <div />
            </div>
          </main>
        </section>
      )}
    </div>
  );
};

export default TrackModal;
