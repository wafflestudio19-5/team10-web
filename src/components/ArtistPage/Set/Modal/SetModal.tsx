import React from "react";
import { IPlaylist } from "../SetPage";
import styles from "./SetModal.module.scss";
import { GrClose } from "react-icons/gr";

const SetModal = ({
  modal,
  closeModal,
  playlist,
}: {
  modal: boolean;
  closeModal: () => void;
  playlist: IPlaylist;
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
            <div className={styles.playlistInfo}>
              {playlist.title} - {playlist.creator.display_name}
            </div>
            <div className={styles.playlistImage}>
              <img
                src={playlist.image || "/default_track_image.svg"}
                onError={onImageError}
                alt={`${playlist.title}의 이미지`}
              />
              <div />
            </div>
          </main>
        </section>
      )}
    </div>
  );
};
export default SetModal;
