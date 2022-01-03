import styles from "./NewItems.module.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";

const NewItems = ({ title, img }: { title: string; img: string }) => {
  const history = useHistory();
  const goTrack = () => {
    history.push("/username/trackname");
  };
  const [play, setPlay] = useState(false);
  const [heart, setHeart] = useState(false);
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
              <BsThreeDots className={styles.details} onClick={clickDots} />
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
