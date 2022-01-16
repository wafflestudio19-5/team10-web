import React, { useEffect, useRef, useState } from "react";
import styles from "./ArtworkModal.module.scss";
import axios from "axios";
import { GrClose } from "react-icons/gr";
import { IYourTracks } from "./YourTracks";
import { useAuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const ArtworkModal = ({
  modal,
  closeModal,
  track,
}: {
  modal: boolean;
  closeModal: () => void;
  track: IYourTracks;
}) => {
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { userSecret } = useAuthContext();

  useEffect(() => {
    if (track) {
      setImageUrl(track.image);
    }
  }, [track]);
  const openFileSelector = (event: any) => {
    event.preventDefault();
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleImageInput: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      setImageFile(event.target.files[0]);
    }
  };

  const onSaveChanges = async () => {
    if (imageFile) {
      const config: any = {
        method: "patch",
        url: `/tracks/${track.id}`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          image_filename: imageFile.name,
        },
      };
      try {
        const response = await axios(config);
        if (response) {
          closeModal();
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400
        ) {
          toast.error("잘못된 요청입니다.");
        }
        console.log(error);
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
          <main>
            <div className={styles.trackInfo}>ArtWork</div>
            <div className={styles.trackImage}>
              {!imageUrl && (
                <img
                  className={styles["upload-track-img"]}
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Sky.jpg"
                  alt="track-img"
                />
              )}
              {imageUrl && (
                <img
                  className={styles["upload-track-img"]}
                  src={imageUrl || track.image || "/default.track_image.svg"}
                  alt={`${track.title}의 이미지`}
                />
              )}
              <button onClick={openFileSelector}>
                <div>Upload new image</div>
              </button>
              <button onClick={closeModal}>
                <div>Cancel</div>
              </button>
              <button onClick={onSaveChanges}>
                <div>Save</div>
              </button>
              <input
                type="file"
                accept="impge/png"
                onChange={handleImageInput}
                ref={imageRef}
              />
              <div />
            </div>
          </main>
        </section>
      )}
    </div>
  );
};

export default ArtworkModal;
