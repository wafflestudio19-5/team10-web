import styles from "./NewItems.module.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useState } from "react";

const NewItems = ({ title, img }: { title: string; img: string }) => {
  const history = useHistory();
  const goTrack = () => {
    history.push("/username/trackname");
  };
  const [play, setPlay] = useState(false);
  const handlePlay = (e: any) => {
    e.stopPropagation();
    setPlay(!play);
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
            <IoMdPause />
          </div>
        ) : (
          <div className={styles.buttonWraaper} onClick={handlePlay}>
            <IoMdPlay />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewItems;
