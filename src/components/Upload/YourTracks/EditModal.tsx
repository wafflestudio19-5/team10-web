import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
// import axios from "axios";
// import toast from "react-hot-toast";
import styles from "./EditModal.module.scss";
import { ITrack } from "../../ArtistPage/Track/TrackPage";
import axios from "axios";
import { GrClose } from "react-icons/gr";
import toast from "react-hot-toast";

interface ITrackPermalink {
  permalink: string;
  id: number;
}

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
  //   const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [permalinkList, setPermalinkList] = useState<ITrackPermalink[]>([]);
  const [genre, setGenre] = useState<string | null | undefined>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(track.title);
    setTPermalink(track.permalink);
    setDescription(track.description);
    setIsPrivate(track.is_private);
    // setTags(track.tags);
    setImageUrl(track.image);
    setTagInput(track.tags.join(", "));
    setGenre(track.genre?.name);
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
    if (event.target.value.length === 0) {
      toast.error("링크를 작성해주세요");
    }
    if (
      permalinkList &&
      permalinkList.find(
        (link: ITrackPermalink) =>
          link.permalink === tPermalink && link.id !== track.id
      )
    ) {
      toast.error(`동일한 링크의 다른 트랙이 존재합니다(${tPermalink})`);
    }
  };

  const changeGenre = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value);
  };

  useEffect(() => {
    const getPermalinks = async () => {
      if (userSecret.jwt) {
        const config: any = {
          method: "get",
          url: `/users/${userSecret.id}/tracks`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          const { data } = await axios(config);
          const results = data.results;
          setPermalinkList(results);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getPermalinks();
  }, [userSecret.jwt]);

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (event.target.value.length === 0) {
      toast.error("제목을 작성해주세요");
    }
  };

  const changeTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const onSaveChanges = async () => {
    // if (
    //   !title ||
    //   !tPermalink ||
    //   permalinkList.find((link) => link.permalink === tPermalink) !== undefined
    // ) {
    //   toast.error("제목과 링크를 확인해 주세요");
    //   return;
    // }
    if (!/^[0-9a-z_-]+$/g.test(tPermalink)) {
      return toast.error(
        `링크에는 숫자, 알파벳 소문자, -, _ 만 사용해 주세요.`
      );
    }
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
          image_extension: imageFile.name.split(".").at(-1),
          tags_input: tagInput.replace(/,/g, "").split(" "),
          genre_input: genre,
        },
      };
      try {
        const { data } = await axios(config);
        if (data) {
          fetchYourTracks();
          setModal(false);
          try {
            const response = await axios.put(
              data.image_presigned_url,
              imageFile,
              {
                headers: {
                  "Content-Type": imageFile.type,
                },
              }
            );
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400
        ) {
          toast.error("잘못된 요청입니다. 제목과 링크를 확인해주세요.");
        }
        console.log(error);
      }
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
          tags_input: tagInput.replace(/,/g, "").split(" "),
          genre_input: genre,
        },
      };
      try {
        const response = await axios(config);
        if (response) {
          fetchYourTracks();
          setModal(false);
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400
        ) {
          toast.error("잘못된 요청입니다. 제목과 링크를 확인해주세요.");
        }
        console.log(error);
      }
    }
    // try {
    //   const response = await axios(config);
    //   if (response) {
    //     fetchYourTracks();
    //     setModal(false);
    //   }
    // } catch (error) {
    //   if (
    //     axios.isAxiosError(error) &&
    //     error.response &&
    //     error.response.status === 400
    //   ) {
    //     toast.error("잘못된 요청입니다. 제목과 링크를 확인해주세요.");
    //   }
    //   console.log(error);
    // }
  };

  const closeModal = () => setModal(false);

  return (
    <div className={styles.modalWrapper} onClick={closeModal}>
      <div className={styles.closeButton} onClick={closeModal}>
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
                src={imageUrl || track.image || "/default.track_image.svg"}
                alt={`${track.title}의 이미지`}
              />
            )}
            <button onClick={openFileSelector}>
              <img src="https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg" />
              <div>Upload image</div>
            </button>
            <input type="file" onChange={handleImageInput} ref={imageRef} />
          </div>
          <div className={styles["upload-info"]}>
            <div className={styles["upload-info-title"]}>
              <label>Title</label>
              <input value={title} onChange={changeTitle} />
              <div className={styles["upload-info-permalink"]}>
                <div>{`soundcloud.com/${userSecret.permalink}/`}</div>
                <input value={tPermalink} onChange={changeTrackPermalink} />
              </div>
            </div>
            <div className={styles["upload-info-genre"]}>
              <label>Genre</label>
              <select
                onChange={(event) => changeGenre(event)}
                value={genre || "None"}
              >
                <option value="None">None</option>
                {/* <option value="Custom">Custom</option> */}
                <option value="Alternative Rock">Alternative Rock</option>
                <option value="Ambient">Ambient</option>
                <option value="Classical">Classical</option>
                <option value="Country">Country</option>
                <option value={`Dance & EDM`}>Dance &#38; EDM</option>
                <option value="Dancehall">Dancehall</option>
                <option value="Deep House">Deep House</option>
                <option value="Disco">Disco</option>
                <option value={"Drum & Bass"}>Drum &#38; Bass</option>
                <option value="Dubstep">Dubstep</option>
                <option value="Electronic">Electronic</option>
                <option value={"Folk & Singer-Songwriter"}>
                  Folk &#38; Singer-Songwriter
                </option>
                <option value="Hip-hop &#38; Rap">Hip-hop &#38; Rap</option>
                <option value="House">House</option>
                <option value="Indie">Indie</option>
                <option value="Jazz &#38; Blues">Jazz &#38; Blues</option>
                <option value="Latin">Latin</option>
                <option value="Metal">Metal</option>
                <option value="Piano">Piano</option>
                <option value="Pop">Pop</option>
                <option value="R&#38;B &#38; Soul">R&#38;B &#38; Soul</option>
                <option value="Reggae">Reggae</option>
                <option value="Reggaeton">Reggaeton</option>
                <option value="Rock">Rock</option>
                <option value="Soundtrack">Soundtrack</option>
                <option value="Techno">Techno</option>
                <option value="Trance">Trance</option>
                <option value="Trap">Trap</option>
                <option value="Triphop">Triphop</option>
                <option value="World">World</option>
              </select>
            </div>
            <div className={styles["upload-info-tag"]}>
              <label>Additional tags</label>
              <input
                value={tagInput}
                placeholder={
                  "Add tags to describe the genre and mood of your track"
                }
                onChange={changeTags}
              />
            </div>
            <div className={styles["upload-info-description"]}>
              <label>Description</label>
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
                  &nbsp;Private
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
