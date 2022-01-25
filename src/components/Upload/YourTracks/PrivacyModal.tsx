// import React, { useEffect, useRef, useState } from "react";
import styles from "./PrivacyModal.module.scss";
import axios from "axios";
import { GrClose } from "react-icons/gr";
import { IYourTracks } from "./YourTracks";
import { ChangeEventHandler, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const PrivacyModal = ({
  modal,
  closeModal,
  fetchYourTracks,
  checkedItems,
  editToggle,
}: {
  modal: boolean;
  closeModal: () => void;
  fetchYourTracks: () => void;
  checkedItems: (IYourTracks | undefined)[];
  editToggle: () => void;
}) => {
  const [privacy, setPrivacy] = useState<boolean | undefined>(undefined);
  const [tags, setTags] = useState("");
  const { userSecret } = useAuthContext();

  const onSaveChanges = async () => {
    for (let i = 0; i < checkedItems.length; i++) {
      const config: any = {
        method: "patch",
        url: `/tracks/${checkedItems[i]?.id}`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          //   ...(tags.length !== 0 && {
          //     tags_input: checkedItems[i]?.tags
          //       .join(", ")
          //       .concat(tags.replace(/,/g, "").split(" ")),
          //   }),
          ...(privacy !== undefined && { is_private: privacy }),
        },
      };
      try {
        await axios(config);
        fetchYourTracks();
        setTags("");
        setPrivacy(undefined);
        closeModal();
        editToggle();
        toast.success(`${checkedItems[i]?.title}을 업데이트했습니다`);
      } catch (error) {
        toast.error(`${checkedItems[i]?.title}을 업데이트하지 못했습니다`);
      }
    }
  };
  const doNotModify = () => setPrivacy(undefined);
  const allPrivate = () => setPrivacy(true);
  const allPublic = () => setPrivacy(false);

  const addTags: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setTags(event.target.value);
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
            <div className={styles.trackInfo}>Privacy and Tags</div>
            <div className={styles.tagInput}>
              <div className={styles.tagLabel}>
                Add new tags to selected tracks
              </div>
              <textarea
                placeholder="Add tags"
                value={tags}
                onChange={(event) => addTags(event)}
              ></textarea>
            </div>
            <div className={styles.privacy}>Privacy</div>
            <div className={styles.checkboxContainer}>
              <div className={styles.noModify}>
                <input
                  type="radio"
                  value="do-not-modify"
                  checked={privacy === undefined}
                  onChange={() => doNotModify()}
                />
                <span>Don't modify</span>
              </div>
              <div className={styles.private}>
                <input
                  type="radio"
                  value="private"
                  checked={privacy === true}
                  onChange={() => allPrivate()}
                />
                <span>All private</span>
              </div>
              <div className={styles.public}>
                <input
                  type="radio"
                  value="public"
                  checked={privacy === false}
                  onChange={() => allPublic()}
                />
                <span>All public</span>
              </div>
            </div>
            <div className={styles.buttons}>
              <button onClick={closeModal} className={styles.cancelButton}>
                <div>Cancel</div>
              </button>
              <button
                onClick={onSaveChanges}
                className={styles.saveButton}
                disabled={privacy === undefined && tags.length === 0}
              >
                <div>Save</div>
              </button>
            </div>
          </main>
        </section>
      )}
    </div>
  );
};

export default PrivacyModal;
