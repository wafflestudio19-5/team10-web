import React from "react";
import styles from "./PlaylistModal.module.scss";
import { GrClose } from "react-icons/gr";
import { IArtist, ITrack } from "../TrackPage";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../../context/AuthContext";
import axios from "axios";

const PlaylistModal = ({
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
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const { userSecret } = useAuthContext();
  const onTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPlaylistTitle(event.target.value);
  };
  const onPrivacyChange = () => setIsPrivate(!isPrivate);
  const onSave = async () => {
    if (playlistTitle.trim().toLowerCase().length === 0) {
      return toast.error("플레이리스트 이름을 작성해 주세요.");
    }
    const config: any = {
      method: "post",
      url: `/sets`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {
        title: playlistTitle,
        permalink: playlistTitle.trim().replace(/[^a-z0-9-_]/gi, ""),
        type: "playlist",
        is_private: isPrivate,
      },
    };
    try {
      const response = await axios(config);
      const trackConfig: any = {
        method: "post",
        url: `/sets/${response.data.id}/tracks`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          track_id: track.id,
          track_ids: [{ id: track.id }],
        },
      };
      try {
        await axios(trackConfig);
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error &&
        error?.response?.status === 400
      ) {
        toast.error("플레이리스트 제목을 변경해 주세요");
      }
    }
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
          <div className={styles.header}>
            <div className={styles.modalTitle}>Create a Playlist</div>
          </div>
          <div className={styles.main}>
            <div className={styles.playlistTitle}>
              <label htmlFor="playlist-title">Playlist title</label>
              <div className={styles.titleInput}>
                <input
                  id="playlist-title"
                  type="text"
                  value={playlistTitle}
                  onChange={(event) => onTitleChange(event)}
                />
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <div className={styles.privacy}>
                <span>Privacy:</span>
              </div>
              <div>
                <input
                  type="radio"
                  value="Public"
                  id="radio-public"
                  checked={!isPrivate}
                  onChange={onPrivacyChange}
                />
                <label htmlFor="radio-public" className={styles.radioLabel}>
                  Public
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  value="Private"
                  id="radio-private"
                  checked={isPrivate}
                  onChange={onPrivacyChange}
                />
                <label htmlFor="radio-private" className={styles.radioLabel}>
                  Private
                </label>
              </div>
              <button className={styles.saveButton} onClick={onSave}>
                Save
              </button>
            </div>
            <div className={styles.trackItem}>
              <div className={styles.image}>
                <img src={track.image || "/default_track_image.svg"} />
              </div>
              <div className={styles.content}>
                <span className={styles.artistName}>
                  {artist.display_name} -
                </span>{" "}
                <span className={styles.trackTitle}>{track.title}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default PlaylistModal;
