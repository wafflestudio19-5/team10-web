import styles from "./NewItems.module.scss";
import play from "../play.png";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

const NewItems = ({ title, img }: { title: string; img: string }) => {
  const history = useHistory();
  const goTrack = () => history.push("/username/trackname");

  return (
    <div className={styles.wrapper}>
      <img src={img} alt="track img" className={styles.track} />
      <Link className={styles.link} to="/username/trackname">
        {title}
      </Link>
      <div className={styles.hover} onClick={goTrack}>
        <img src={play} alt="playButton" className={styles.play} />
      </div>
    </div>
  );
};

export default NewItems;
