import styles from "./NewItems.module.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const NewItems = ({
  title,
  img,
  trackId,
  likeListId,
  trackPermalink,
  artistPermalink,
  setLikeList,
}: {
  title: string;
  img: string;
  trackId: number | string;
  likeListId: any;
  trackPermalink: string;
  artistPermalink: string;
  setLikeList: any;
}) => {
  const history = useHistory();
  const goTrack = () => {
    history.push(`/${permalink.artistPermal}/${permalink.trackPermal}`);
  };
  const [play, setPlay] = useState(false);
  const [heart, setHeart] = useState(false);
  const [permalink, setPermalink] = useState({
    artistPermal: "",
    trackPermal: "",
  });
  const { userSecret } = useAuthContext();
  const handlePlay = (e: any) => {
    e.stopPropagation();
    setPlay(!play);
  };
  const handleHeart = async (e: any) => {
    e.stopPropagation();
    if (heart === false) {
      await axios({
        method: "post",
        url: `/likes/tracks/${trackId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      });
      setHeart(!heart);
    } else {
      await axios({
        method: "delete",
        url: `/likes/tracks/${trackId}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      });
      setHeart(!heart);
    }
    await axios
      .get(`/users/${userSecret.id}/likes/tracks`)
      .then((res) => {
        setLikeList(res.data.results);
      })
      .catch(() => toast.error("like list 불러오기를 실패하였습니다"));
  };
  const clickDots = (e: any) => {
    e.stopPropagation();
  };
  useEffect(() => {
    if (trackId <= 999990 && likeListId[0] !== -1) {
      const permalink = {
        artistPermal: artistPermalink,
        trackPermal: trackPermalink,
      };
      setPermalink(permalink);

      setHeart(likeListId.includes(trackId));
    }
  }, [trackId, likeListId]);
  return (
    <div className={styles.wrapper}>
      {img === null ? (
        <svg
          className={styles.track}
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="155.294"
            y="155.294"
            width="64.7059"
            height="64.7059"
            fill="#ED8573"
          />
          <rect
            x="64.7059"
            y="155.294"
            width="64.7059"
            height="64.7059"
            fill="#F0975E"
          />
          <rect
            x="155.294"
            y="64.7059"
            width="64.7059"
            height="64.7059"
            fill="#F0975E"
          />
          <rect
            x="64.7059"
            y="64.7059"
            width="64.7059"
            height="64.7059"
            fill="#F0975E"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M64.7059 0H38.8236V38.8235H0V64.7059H38.8236V129.412H0V155.294H38.8236V220H64.7059V155.294H129.412V220H155.294V155.294H220V129.412H155.294V64.7059H220V38.8235H155.294V0H129.412V38.8235H64.7059V0ZM129.412 129.412V64.7059H64.7059V129.412H129.412Z"
            fill="#27181D"
          />
        </svg>
      ) : (
        <img src={img} alt="track img" className={styles.track} />
      )}

      <Link
        className={styles.link}
        to={`/${permalink.artistPermal}/${permalink.trackPermal}`}
      >
        {title}
      </Link>
      <div className={styles.hover} onClick={goTrack}>
        {play ? (
          <div className={styles.buttonWraaper} onClick={handlePlay}>
            <IoMdPause className={styles.playButton} />
            <div className={styles.functions}>
              <AiFillHeart
                className={heart ? styles.liked : styles.like}
                onClick={handleHeart}
              />
              <BsThreeDots className={styles.dots} onClick={clickDots} />
            </div>
          </div>
        ) : (
          <div className={styles.buttonWraaper} onClick={handlePlay}>
            <IoMdPlay className={styles.playButton} />
            <div className={styles.functions}>
              <AiFillHeart
                className={heart ? styles.liked : styles.like}
                onClick={handleHeart}
              />
              <BsThreeDots className={styles.dots} onClick={clickDots} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewItems;
