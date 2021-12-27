import { useHistory } from "react-router-dom";
import { ITrack } from "../TrackPage";
import styles from "./TrackTag.module.scss";

const TrackTag = ({ track }: { track: ITrack }) => {
  const history = useHistory();
  const clickTag = () => history.push(`/tags/${track.tags[0]}`);
  return (
    <div className={styles.titleInfo}>
      <div className={styles.releasedDate}>{track.created_at}</div>
      <div className={styles.tag} onClick={clickTag}>
        #{track.tags[0]}
      </div>
    </div>
  );
};

export default TrackTag;
