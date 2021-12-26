import "./UploadModal.scss";

function UploadModal() {
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
          <img
            className="upload-track-img"
            src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Sky.jpg"
            alt="track-img"
          />
          <button>
            <img
              src="https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg"
              alt="img"
            />
            <div>Upload image</div>
          </button>
        </div>

        <div className="upload-info">
          <div className="upload-info-title">
            <text>Title</text>
            <input placeholder="Name your track" />
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
            <input placeholder="Describe your track" />
          </div>
          <div className="upload-info-privacy">
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
          </div>
        </div>
      </div>

      <div className="upload-modal-button">
        <button className="cancel-button">Cancel</button>
        <button className="save-button">Save</button>
      </div>
    </div>
  );
}

export default UploadModal;
