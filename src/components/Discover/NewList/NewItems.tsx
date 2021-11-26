import styles from "./NewItems.module.scss";
import play from "../play.png";

const NewItems = ({ title, img }: { title: string; img: string }) => {
  return (
    <div className={styles.wrapper}>
      <img src={img} alt="track img" className={styles.track} />
      <a href="https://soundcloud.com">{title}</a>
      <div className={styles.hover}>
        <img src={play} alt="playButton" className={styles.play} />
      </div>
    </div>
  );
};

export default NewItems;
