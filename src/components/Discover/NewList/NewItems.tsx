import styles from "./NewItems.module.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";

const NewItems = ({
  title,
  img,
  trackIid,
}: {
  title: string;
  img: string;
  trackIid: number | string;
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
  const handlePlay = (e: any) => {
    e.stopPropagation();
    setPlay(!play);
  };
  const handleHeart = (e: any) => {
    e.stopPropagation();
    setHeart(!heart);
  };
  const clickDots = (e: any) => {
    e.stopPropagation();
  };
  useEffect(() => {
    trackIid <= 999990
      ? axios.get(`/tracks/${trackIid}`).then((r) => {
          const permalink = {
            artistPermal: r.data.artist.permalink,
            trackPermal: r.data.permalink,
          };
          setPermalink(permalink);
        })
      : null;
  }, [trackIid]);
  return (
    <div className={styles.wrapper}>
      <img src={img} alt="track img" className={styles.track} />
      <Link className={styles.link} to="/username/trackname">
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
