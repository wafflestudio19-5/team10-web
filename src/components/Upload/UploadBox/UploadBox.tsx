import "./UploadBox.scss";

function UploadBox({ setSelectedFile, setModal }: any) {
  const handleFileInput = async (event: any) => {
    setSelectedFile(event.target.files[0]);
    setModal(true);
  };

  const clickFileInput = (event: any) => {
    event.preventDefault();
    let fileInput = document.getElementById("file-input");
    fileInput?.click();
  };

  return (
    <div className="upload-box">
      <form className={"upload-form"}>
        <div className="upload-text">
          Drag and drop your tracks & albums here
        </div>
        <button onClick={clickFileInput}>or choose files to upload</button>
        <input
          type="file"
          id="file-input"
          className="file-input"
          accept=".mp3, .wav"
          onChange={handleFileInput}
        />
        {/* <div className="upload-playlist">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
            />
            <label className="form-check-label">
              Make a playlist when multiple files are selected
            </label>
          </div>
        </div> */}
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
