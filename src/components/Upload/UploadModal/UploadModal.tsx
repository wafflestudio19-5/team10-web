import axios from "axios";
import { useState } from "react";
import { AuthContext } from "../../../Context";
import "./UploadModal.scss";

function UploadModal({ selectedFile }: any) {
  const { userSecret } = AuthContext();
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

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

  const handleUpload = (e: any) => {
    e.preventDefault();
    axios
      .post(
        "https://api.soundwaffle.com/tracks",
        {
          title: title,
          permalink: userSecret.permalink,
          description: description,
          is_private: isPrivate,
          audio_filename: selectedFile.name,
          image_filename: imageFile.name,
        },
        {
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(userSecret);
  };

  return (
    <div className="upload-modal">
      <div className="upload-modal-header">
        <div className="upload-basic-info">Basic info</div>
        <div>Metadata</div>
        <div>Permissions</div>
        <div>Advanced</div>
      </div>

      <div className="upload-modal-body">
        <div className="upload-image">
          {!imageUrl && (
            <img
              className="upload-track-img"
              src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Sky.jpg"
              alt="track-img"
            />
          )}
          {imageUrl && (
            <img className="upload-track-img" src={imageUrl} alt="img" />
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

        <div className="upload-info">
          <div className="upload-info-title">
            <text>Title</text>
            <input
              placeholder="Name your track"
              onChange={(e) => setTitle(e.target.value)}
            />
            <div>soundcloud.com/username/title</div>
          </div>
          <div className="upload-info-genre">
            <text>Genre</text>
            <select>
              <option value="None">None</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className="upload-info-tag">
            <text>Additional tags</text>
            <input placeholder="Add tags to describe the genre and mood of your track" />
          </div>
          <div className="upload-info-description">
            <text>Description</text>
            <input
              placeholder="Describe your track"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="upload-info-privacy">
            <text>Privacy:</text>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onChange={() => setIsPrivate(false)}
              />
              <label className="form-check-label">Public</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                onChange={() => setIsPrivate(true)}
              />
              <label className="form-check-label">Privacy</label>
            </div>
          </div>
        </div>
      </div>

      <div className="upload-modal-button">
        <button className="cancel-button">Cancel</button>
        <button className="save-button" onClick={handleUpload}>
          Save
        </button>
      </div>
    </div>
  );
}

export default UploadModal;
