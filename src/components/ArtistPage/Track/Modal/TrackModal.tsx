import React from "react";
import styles from "./TrackModal.module.scss";
import { GrClose } from "react-icons/gr";
import { ITrack } from "../TrackPage";

const TrackModal = ({
  modal,
  closeModal,
  track,
}: {
  modal: boolean;
  closeModal: () => void;
  track: ITrack;
}) => {
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
              {track.title} - {track.artist}
            </div>
            <div className={styles.trackImage}>
              {track.image ? (
                <img src={track.image} alt={`${track.title}의 트랙 이미지`} />
              ) : null}
            </div>
          </main>
        </section>
      )}
    </div>
  );
};

export default TrackModal;
