import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
// import axios from "axios";
// import toast from "react-hot-toast";
import styles from "./EditModal.module.scss";
import { ITrack } from "../../ArtistPage/Track/TrackPage";
import axios from "axios";
import { GrClose } from "react-icons/gr";

const EditModal = ({
  setModal,
  track,
  fetchYourTracks,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  track: ITrack;
  fetchYourTracks: () => void;
}) => {
  const { userSecret } = useAuthContext();

  const [imageUrl, setImageUrl] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [tPermalink, setTPermalink] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(track.title);
    setTPermalink(track.permalink);
    setDescription(track.description);
    setIsPrivate(track.is_private);
    setTags(track.tags);
    setImageUrl(track.image);
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

  const changeTrackPermalink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTPermalink(event.target.value);
  };

  const onSaveChanges = async () => {
    let config: any;
    if (imageFile) {
      config = {
        method: "patch",
        url: `/tracks/${track.id}`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          title: title,
          permalink: tPermalink,
          description: description,
          is_private: isPrivate,
          image_filename: imageFile.name,
        },
      };
    } else {
      config = {
        method: "patch",
        url: `/tracks/${track.id}`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          title: title,
          permalink: tPermalink,
          description: description,
          is_private: isPrivate,
        },
      };
    }
    try {
      const response = await axios(config);
      if (response) {
        fetchYourTracks();
        setModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.modalWrapper} onClick={() => setModal(false)}>
      <div className={styles.closeButton} onClick={() => setModal(false)}>
        <GrClose />
      </div>
      <div
        className={styles["upload-modal"]}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles["upload-modal-header"]}>
          <div className={styles["upload-basic-info"]}>Basic info</div>
          {/* <div>Metadata</div>
        <div>Permissions</div>
        <div>Advanced</div> */}
        </div>
        <div className={styles["upload-modal-body"]}>
          <div className={styles["upload-image"]}>
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
                src={imageUrl}
                alt={`${track.title}의 이미지`}
              />
            )}
            <button onClick={openFileSelector}>
              <img src="https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg" />
              <div>Upload image</div>
            </button>
            <input
              type="file"
              accept="impge/png"
              onChange={handleImageInput}
              ref={imageRef}
            />
          </div>
          <div className={styles["upload-info"]}>
            <div className={styles["upload-info-title"]}>
              <text>Title</text>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <div className={styles["upload-info-permalink"]}>
                <div>{`soundcloud.com/${userSecret.permalink}/`}</div>
                <input value={tPermalink} onChange={changeTrackPermalink} />
              </div>
            </div>
            <div className={styles["upload-info-genre"]}>
              <text>Genre</text>
              <select>
                <option value="None">None</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className={styles["upload-info-tag"]}>
              <text>Additional tags</text>
              <input
                placeholder={
                  tags.length !== 0
                    ? ""
                    : "Add tags to describe the genre and mood of your track"
                }
              />
            </div>
            <div className={styles["upload-info-description"]}>
              <text>Description</text>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className={styles["upload-info-privacy"]}>
              <text>Privacy:</text>
              <div className={styles["form-check"]}>
                <input
                  className={styles["form-check-input"]}
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                />
                <label className={styles["form-check-label"]}>
                  &nbsp;Public
                </label>
              </div>
              <div className={styles["form-check"]}>
                <input
                  className={styles["form-check-input"]}
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                />
                <label className={styles["form-check-label"]}>
                  &nbsp;Privacy
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["upload-modal-button"]}>
          <button
            className={styles["cancel-button"]}
            onClick={() => setModal(false)}
          >
            Cancel
          </button>
          <button className={styles["save-button"]} onClick={onSaveChanges}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
