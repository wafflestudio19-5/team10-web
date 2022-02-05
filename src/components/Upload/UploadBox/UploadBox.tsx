import { useState } from "react";
import "./UploadBox.scss";

function UploadBox({ setSelectedFiles, setModal, setPlaylistModal }: any) {
  const [isPlaylist, setIsPlaylist] = useState<boolean>(false);

  const handleFileInput = async (event: any) => {
    if (!isPlaylist) {
      setModal(true);
      setSelectedFiles(event.target.files[0]);
    } else {
      setPlaylistModal(true);
      setSelectedFiles(event.target.files);
    }
  };

  const clickFileInput = (event: any) => {
    event.preventDefault();
    let fileInput = document.getElementById("file-input");
    fileInput?.click();
  };

  return (
    <div className="upload-box">
      <form className={"upload-form"}>
        <div className="upload-text">Make your own Track & Playlist</div>
        <button onClick={clickFileInput}>choose a file to upload</button>
        {isPlaylist && (
          <input
            type="file"
            id="file-input"
            className="file-input"
            accept=".mp3, .wav"
            multiple
            onChange={handleFileInput}
          />
        )}
        {!isPlaylist && (
          <input
            type="file"
            id="file-input"
            className="file-input"
            accept=".mp3, .wav"
            onChange={handleFileInput}
          />
        )}
        <div className="upload-playlist">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              onChange={() => setIsPlaylist(!isPlaylist)}
            />
            <label className="form-check-label">
              Make a playlist (with multiple files)
            </label>
          </div>
        </div>
        {/* <div className="upload-privacy">
          <text>Privacy:</text>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
            />
            <label className="form-check-label">Public</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
            />
            <label className="form-check-label">Privacy</label>
          </div>
        </div> */}
      </form>
    </div>
  );
}

export default UploadBox;
