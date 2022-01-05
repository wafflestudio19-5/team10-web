import styles from "./NewItems.module.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";

const NewItems = ({
  title,
  img,
  trackId,
  likeListId,
}: {
  title: string;
  img: string;
  trackId: number | string;
  likeListId: any;
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
  };
  const clickDots = (e: any) => {
    e.stopPropagation();
  };
  useEffect(() => {
    if (trackId <= 999990 && likeListId[0] !== undefined) {
      axios.get(`/tracks/${trackId}`).then((r) => {
        const permalink = {
          artistPermal: r.data.artist.permalink,
          trackPermal: r.data.permalink,
        };
        setPermalink(permalink);
      });
      setHeart(likeListId.includes(trackId));
    }
  }, [trackId, likeListId]);
  return (
    <div className={styles.wrapper}>
      <img src={img} alt="track img" className={styles.track} />
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
