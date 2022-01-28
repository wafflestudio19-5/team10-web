import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/AuthContext";
import { TagsInput } from "react-tag-input-component";
import "./UploadModal.scss";

function UploadModal({ selectedFile, setModal }: any) {
  const { userSecret } = useAuthContext();

  const permalink = userSecret.permalink;
  const trackPermalink = selectedFile.name.substr(
    0,
    selectedFile.name.lastIndexOf(".")
  );

  const [imageUrl, setImageUrl] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [tPermalink, setTPermalink] = useState<string>(trackPermalink);
  const [genre, setGenre] = useState<string | undefined>();
  const [customGenre, setCustomGenre] = useState<any>();
  const [tags, setTags] = useState<any>();

  const clickImageInput = (event: any) => {
    event.preventDefault();
    let fileInput = document.getElementById("file-input-up");
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

  const cancelModal = () => {
    setModal(false);
  };

  const handleUpload = (e: any) => {
    e.preventDefault();
    const myToken = localStorage.getItem("jwt_token");
    axios
      .post(
        "https://api.soundwaffle.com/tracks",
        {
          title: title,
          permalink: tPermalink,
          description: description,
          genre_input: genre === "custom" ? customGenre : undefined,
          tags_input: tags !== [] ? tags : undefined,
          is_private: isPrivate,
          audio_extension: selectedFile.name.substr(
            -selectedFile.name.length + selectedFile.name.lastIndexOf(`.`) + 1
          ),
          image_extension: imageFile
            ? imageFile.name.substr(
                -imageFile.name.length + imageFile.name.lastIndexOf(`.`) + 1
              )
            : undefined,
        },
        {
          headers: {
            Authorization: `JWT ${myToken}`,
          },
        }
      )
      .then((res) => {
        // 음악 업로드
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

        // 이미지 업로드
        if (imageFile) {
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
        }
        setModal(false);
      })
      .catch((err) => {
        console.log(err.response);
        toast("업로드 실패");
        if (title === "") {
          toast("❗️ 제목은 필수입니다.");
        }
        if (/\s/g.test(tPermalink)) {
          toast("❗️ 트랙 url에서 띄어쓰기는 불가능합니다.");
        }
        if (
          err.response.data.permalink &&
          err.response.data.permalink[0] ===
            `Enter a valid "slug" consisting of letters, numbers, underscores or hyphens.`
        ) {
          toast("❗️ 트랙 url은 영어 / 숫자만 가능합니다");
        }
        if (
          err.response.data.non_field_errors &&
          err.response.data.non_field_errors[0] ===
            "Already existing permalink for the requested user."
        ) {
          toast("❗️ 트랙 url이 중복되었습니다.");
        }
        if (err.response.status === 500) {
          toast("❗️ 서버오류");
        }
      });
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
          <input
            type="file"
            id="file-input-up"
            accept=".png"
            onChange={imageToUrl}
          />
        </div>

        <div className="upload-info">
          <div className="upload-info-title">
            <text>Title *</text>
            <input
              placeholder="Name your track"
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="upload-info-permalink">
              <div>{`soundcloud.com/${permalink}/`}</div>
              <input value={tPermalink} onChange={changeTrackPermalink} />
            </div>
          </div>
          <div className="upload-info-genre-custom">
            <div className="upload-info-genre">
              <text>Genre</text>
              <select onChange={(e: any) => setGenre(e.target.value)}>
                <option value="none">None</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {genre === "custom" && (
              <div className="upload-info-genre">
                <text>Custom Genre</text>
                <input onChange={(e) => setCustomGenre(e.target.value)} />
              </div>
            )}
          </div>
          <div className="upload-info-tag">
            <text>Additional tags</text>
            <TagsInput
              value={tags}
              onChange={setTags}
              name="tags"
              placeHolder="Describe the genre and mood of your track. (Press Enter)"
            />
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
              <label className="form-check-label">Public (default)</label>
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
        <button className="cancel-button" onClick={cancelModal}>
          Cancel
        </button>
        <button className="save-button" onClick={handleUpload}>
          Save
        </button>
      </div>
    </div>
  );
}

export default UploadModal;
