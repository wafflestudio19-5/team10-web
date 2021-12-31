import { useState } from "react";
import "./EditModal.scss";

function EditModal({ modal, setModal }: any) {
  const [imageUrl, setImageUrl] = useState<any>(null);

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
  };

  return (
    <div className={modal ? "modal open" : "modal"}>
      {modal ? (
        <section className={"modal-section"}>
          <div className="edit-modal-header">Edit your Profile</div>

          <div className="edit-modal-body">
            <div className="edit-image">
              {!imageUrl && (
                <img
                  className="edit-profile-img"
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Sky.jpg"
                  alt="track-img"
                />
              )}
              {imageUrl && (
                <img className="edit-profile-img" src={imageUrl} alt="img" />
              )}
              <button onClick={clickImageInput}>
                <img
                  src="https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg"
                  alt="img"
                />
                <div>Update image</div>
              </button>
              <input type="file" id="file-input" onChange={imageToUrl} />
            </div>

            <div className="edit-info">
              <div className="edit-info-dpname">
                <text>Display name</text>
                <input placeholder="이름" />
              </div>
              <div className="edit-info-url">
                <text>Profile URL</text>
                <div>soundcloud.com/permalink</div>
              </div>
              <div className="edit-info-flname">
                <div>
                  <text>First name</text>
                  <input placeholder="이름" />
                </div>
                <div>
                  <text>Last name</text>
                  <input placeholder="성" />
                </div>
              </div>
              <div className="edit-info-flname">
                <div>
                  <text>City</text>
                  <input placeholder="도시" />
                </div>
                <div>
                  <text>Country</text>
                  <input placeholder="국가" />
                </div>
              </div>
              <div className="edit-info-bio">
                <text>Bio</text>
                <input placeholder="Tell the world a little bit about yourself. The shorter the better." />
              </div>
            </div>
          </div>

          <div className="edit-modal-button">
            <button className="cancel-button" onClick={() => setModal(false)}>
              Cancel
            </button>
            <button className="save-button">Save changes</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default EditModal;
