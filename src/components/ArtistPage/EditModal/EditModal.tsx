import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/AuthContext";
import "./EditModal.scss";

function EditModal({ user, modal, setModal }: any) {
  const { userSecret } = useAuthContext();

  const [displayName, setDisplayName] = useState<string>(user.display_name);
  const [firstName, setFirstName] = useState<string>(user.first_name);
  const [lastName, setLastName] = useState<string>(user.last_name);
  const [city, setCity] = useState<string>(user.city);
  const [country, setCountry] = useState<string>(user.country);
  const [bio, setBio] = useState<string>(user.bio);
  const [profileImg, setProfileImg] = useState<any>(user.image_profile);
  const [imgFile, setImgFile] = useState<any>();
  const [imgChanged, setImgChanged] = useState<boolean>(false);

  const clickImageInput = (event: any) => {
    event.preventDefault();
    let fileInput = document.getElementById("file-input2");
    fileInput?.click();
  };

  const clearEvent = (event: any) => {
    event.target.value = null;
  };

  const imgToUrl = (event: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setProfileImg(reader.result);
    };
    setImgFile(event.target.files[0]);
    setImgChanged(true);
  };

  const changeProfile = async () => {
    const changeText = async () => {
      const config: any = {
        method: "patch",
        url: `/users/me`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          display_name: displayName,
          first_name: firstName,
          last_name: lastName,
          city: city,
          country: country,
          bio: bio,
        },
      };
      try {
        await axios(config);
        toast("프로필 업데이트 성공");
        console.log(imgFile);
        setModal(false);
      } catch (error) {
        toast("프로필 업데이트 실패");
      }
    };
    const changeImg = async () => {
      const config: any = {
        method: "patch",
        url: `/users/me`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {
          image_profile_filename: imgFile.name,
        },
      };
      try {
        const res = await axios(config);
        const img_options = {
          headers: {
            "Content-Type": imgFile.type,
          },
        };
        axios
          .put(res.data.image_profile_presigned_url, imgFile, img_options)
          .catch(() => {
            toast("이미지파일 업로드 실패");
          });
      } catch (error) {
        toast("이미지파일 업로드 실패");
      }
    };
    changeText();
    if (imgChanged) {
      changeImg();
    }
  };

  return (
    <div className={modal ? "modal open" : "modal"}>
      {modal ? (
        <section className={"modal-section"}>
          <div className="edit-modal-header">Edit your Profile</div>

          <div className="edit-modal-body">
            <div className="edit-image">
              {profileImg === null && (
                <img
                  className="edit-profile-img"
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Sky.jpg"
                  alt="track-img"
                />
              )}
              {profileImg !== null && (
                <img className="edit-profile-img" src={profileImg} alt="img" />
              )}
              <button onClick={clickImageInput}>
                <img
                  src="https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg"
                  alt="img"
                />
                <div>Update image</div>
              </button>
              <input
                type="file"
                id="file-input2"
                onClick={clearEvent}
                onChange={imgToUrl}
              />
            </div>

            <div className="edit-info">
              <div className="edit-info-dpname">
                <text>Display name</text>
                <input
                  placeholder="이름"
                  value={displayName}
                  onChange={(event: any) => setDisplayName(event.target.value)}
                />
              </div>
              <div className="edit-info-url">
                <text>Profile URL</text>
                <div>soundcloud.com/{user.permalink}</div>
              </div>
              <div className="edit-info-flname">
                <div>
                  <text>First name</text>
                  <input
                    placeholder="이름"
                    value={firstName}
                    onChange={(event: any) => setFirstName(event.target.value)}
                  />
                </div>
                <div>
                  <text>Last name</text>
                  <input
                    placeholder="성"
                    value={lastName}
                    onChange={(event: any) => setLastName(event.target.value)}
                  />
                </div>
              </div>
              <div className="edit-info-flname">
                <div>
                  <text>City</text>
                  <input
                    placeholder="도시"
                    value={city}
                    onChange={(event: any) => setCity(event.target.value)}
                  />
                </div>
                <div>
                  <text>Country</text>
                  <input
                    placeholder="국가"
                    value={country}
                    onChange={(event: any) => setCountry(event.target.value)}
                  />
                </div>
              </div>
              <div className="edit-info-bio">
                <text>Bio</text>
                <input
                  placeholder="Tell the world a little bit about yourself. The shorter the better."
                  value={bio}
                  onChange={(event: any) => setBio(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="edit-modal-button">
            <button className="cancel-button" onClick={() => setModal(false)}>
              Cancel
            </button>
            <button className="save-button" onClick={changeProfile}>
              Save changes
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default EditModal;
