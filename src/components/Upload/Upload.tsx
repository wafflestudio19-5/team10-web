import axios from "axios";
import "./Upload.scss";

function Upload() {
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJleHAiOjE2Mzk4NDMzOTQsImVtYWlsIjoiZXhhbXBsZUBleGFtcGxlLmNvbSIsIm9yaWdfaWF0IjoxNjM5ODM2MTk0fQ.PUqQ_CIXoxBtbDdJd2URppo9aoQCci4rvVyVu9D_EX8";
  const changeFileInput = () => {
    axios
      .post(
        "https://api.soundwaffle.com/tracks",
        {
          title: "example_track",
          permalink: "xdlcfiw69486",
          audio_filename: "example.mp3",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={"uploadpage-wrapper"}>
      <div className={"uploadpage"}>
        <div className={"upload-header"}>
          <div className={"upload-header-left"}>
            <a href={"/upload"}>Upload</a>
            <a href={"/you/mastering"}>Mastering</a>
            <a href={"/you/tracks"}>Your tracks</a>
            <a href={"/pro"}>Pro Plans</a>
          </div>
        </div>

        <div className="upload-box">
          <form className={"upload-form"}>
            <div className="upload-text">
              Drag and drop your tracks & albums here
            </div>
            <button onClick={changeFileInput}>upload</button>
            <input className="file-input" type="file" />
            <div className="upload-playlist">
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
            </div>
            <div className="upload-privacy">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
