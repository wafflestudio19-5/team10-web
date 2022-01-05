import { BiPencil } from "react-icons/bi";
import { MdPlaylistAdd } from "react-icons/md";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import { BsSoundwave } from "react-icons/bs";
import styles from "./YourTracks.module.scss";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import UploadHeader from "../UploadHeader/UploadHeader";
import { useAuthContext } from "../../../context/AuthContext";
import axios from "axios";

interface IYourTracks {
  id: number;
  title: string;
  permalink: string;
  audio: string;
  image: string;
  like_count: string;
  repost_count: string;
  comment_count: string;
  genre: number;
  count: number;
}

const YourTracks = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [yourTracks, setYourTracks] = useState<IYourTracks[]>([]);
  const { userSecret } = useAuthContext();

  useEffect(() => {
    const fetchYourTracks = async () => {
      if (userSecret.jwt) {
        const config: any = {
          method: "get",
          url: `/users/me`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          const response = await axios(config);
          const userId = response.data.id;
          const tracksConfig: any = {
            method: "get",
            url: `/users/${userId}/tracks`,
            headers: {
              Authorization: `JWT ${userSecret.jwt}`,
            },
            data: {},
          };
          try {
            const { data } = await axios(tracksConfig);
            setYourTracks(data);
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchYourTracks();
  }, [userSecret]);
  console.log(yourTracks);

  const editToggle = () => setIsEditOpen(!isEditOpen);

  const history = useHistory();
  const uploadTrack = () => history.push(`/upload`);

  return (
    <div className={styles.yourTracksPage}>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.uploadHeader}>
            <UploadHeader />
          </div>
          <div className={styles.header}>
            <div className={styles.title}>
              <span>Your tracks</span>
            </div>
            <div className={styles.editButtons}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" />
              </div>
              <div className={styles.dropdownContainer}>
                <button className={styles.editTracks} onClick={editToggle}>
                  <BiPencil />
                  <span>Edit tracks</span>
                  <AiOutlineDown />
                </button>
                {isEditOpen && (
                  <ul>
                    <li>Privacy and tags</li>
                    <li>Artwork</li>
                  </ul>
                )}
              </div>
              <button className={styles.addToPlaylist}>
                <MdPlaylistAdd />
                <span>&nbsp;&nbsp;Add to playlist</span>
              </button>
              <div className={styles.pageSelector}>
                <div className={styles.pageInfo}>1 - 0 of 0 tracks</div>
                <div className={styles.pageButtons}>
                  <button className={styles.backButton}>
                    <AiFillCaretLeft />
                  </button>
                  <button className={styles.nextButton}>
                    <AiFillCaretRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {yourTracks.length ? (
            <div></div>
          ) : (
            <div className={styles.uploadTrack}>
              <div className={styles.waveContainer}>
                <BsSoundwave />
              </div>
              <div className={styles.seemQuiet}>
                Seems a little quiet over here
              </div>
              <div className={styles.uploadLink} onClick={uploadTrack}>
                Upload a track to share with your followers.
              </div>
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
};

export default YourTracks;
