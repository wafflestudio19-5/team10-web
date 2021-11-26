import React from "react";
import styles from "./TrackModal.module.scss";
import { GrClose } from "react-icons/gr";

const TrackModal = ({
  modal,
  closeModal,
}: {
  modal: boolean;
  closeModal: () => void;
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
            <div className={styles.trackInfo}>Track Name - Artist Name</div>
            <div className={styles.trackImage} />
          </main>
        </section>
      )}
    </div>
  );
};

export default TrackModal;
