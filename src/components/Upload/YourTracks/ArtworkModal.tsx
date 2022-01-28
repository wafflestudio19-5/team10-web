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
  fetchYourTracks,
  checkedItems,
}: {
  modal: boolean;
  closeModal: () => void;
  track: IYourTracks;
  fetchYourTracks: () => void;
  checkedItems: number[];
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
      for (let i = 0; i < checkedItems.length; i++) {
        const config: any = {
          method: "patch",
          url: `/tracks/${checkedItems[i]}`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {
            image_extension: imageFile.name.split(".").at(-1),
          },
        };
        try {
          const { data } = await axios(config);
          if (data) {
            try {
              await axios.put(data.image_presigned_url, imageFile, {
                headers: {
                  "Content-Type": imageFile.type,
                },
              });
              toast.success("이미지 업로드에 성공했습니다");
              fetchYourTracks();
              closeModal();
            } catch (error) {
              toast.error("이미지 업로드에 실패했습니다");
              console.log(error);
            }
          }
        } catch (error) {
          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 400
          ) {
            toast.error("잘못된 요청입니다.");
          }
          toast.error("이미지 업로드에 실패했습니다");
        }
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
              <div className={styles.buttons}>
                <button
                  onClick={openFileSelector}
                  className={styles.uploadButton}
                >
                  <div>Upload new image</div>
                </button>
                <input type="file" onChange={handleImageInput} ref={imageRef} />
                <button onClick={closeModal} className={styles.cancelButton}>
                  <div>Cancel</div>
                </button>
                <button
                  onClick={onSaveChanges}
                  className={styles.saveButton}
                  disabled={!imageFile}
                >
                  <div>Save</div>
                </button>
              </div>
            </div>
          </main>
        </section>
      )}
    </div>
  );
};

export default ArtworkModal;
