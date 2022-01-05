import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./EditModal.module.scss";

const EditModal = ({ selectedFile, setModal }: any) => {
  const { userSecret } = useAuthContext();

  const permalink = userSecret.permalink;
  const token = userSecret.jwt;
  const trackPermalink = selectedFile.name.substr(
    0,
    selectedFile.name.indexOf(".")
  );

  const [imageUrl, setImageUrl] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [tPermalink, setTPermalink] = useState<string>(trackPermalink);

  const clickImageInput = (event: any) => {
    event.preventDefault();
    let fileInput = document.getElementById("file-input");
    fileInput?.click();
  };

  const imageToUrl = (event: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    setImageFile(event.target.files[0]);
  };

  const changeTrackPermalink = (event: any) => {
    setTPermalink(event.target.value);
  };

  const handleUpload = (e: any) => {
    e.preventDefault();
    axios
      .post(
        "https://api.soundwaffle.com/tracks",
        {
          title: title,
          permalink: tPermalink,
          description: description,
          is_private: isPrivate,
          audio_filename: selectedFile.name,
          image_filename: imageFile.name,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      )
      .then((res) => {
        const music_options = {
          headers: {
            "Content-Type": selectedFile.type,
          },
        };

        axios
          .put(res.data.audio_presigned_url, selectedFile, music_options)
          .then(() => {
            toast("음악파일 업로드 완료");
          })
          .catch(() => {
            toast("음악파일 업로드 실패");
          });

        const img_options = {
          headers: {
            "Content-Type": imageFile.type,
          },
        };

        axios
          .put(res.data.image_presigned_url, imageFile, img_options)
          .then(() => {
            toast("이미지파일 업로드 완료");
          })
          .catch(() => {
            toast("이미지파일 업로드 실패");
          });

        setModal(false);
      })
      .catch((err) => {
        toast("업로드 실패");
        console.log(err);
        setModal(false);
      });
  };

  return (
    <div className={styles["upload-modal"]}>
      <div className={styles["upload-modal-header"]}>
        <div className={styles["upload-basic-info"]}>Basic info</div>
        <div>Metadata</div>
        <div>Permissions</div>
        <div>Advanced</div>
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
              alt="img"
            />
          )}
          <button onClick={clickImageInput}>
            <img
              src="https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg"
              alt="img"
            />
            <div>Upload image</div>
          </button>
          <input type="file" id="file-input" onChange={imageToUrl} />
        </div>

        <div className={styles["upload-info"]}>
          <div className={styles["upload-info-title"]}>
            <text>Title</text>
            <input
              placeholder="Name your track"
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles["upload-info-permalink"]}>
              <div>{`soundcloud.com/${permalink}/`}</div>
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
            <input placeholder="Add tags to describe the genre and mood of your track" />
          </div>
          <div className={styles["upload-info-description"]}>
            <text>Description</text>
            <input
              placeholder="Describe your track"
              onChange={(e) => setDescription(e.target.value)}
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
                onChange={() => setIsPrivate(false)}
              />
              <label className={styles["form-check-label"]}>Public</label>
            </div>
            <div className={styles["form-check"]}>
              <input
                className={styles["form-check-input"]}
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                onChange={() => setIsPrivate(true)}
              />
              <label className={styles["form-check-label"]}>Privacy</label>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["upload-modal-button"]}>
        <button className={styles["cancel-button"]}>Cancel</button>
        <button className={styles["save-button"]} onClick={handleUpload}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditModal;
