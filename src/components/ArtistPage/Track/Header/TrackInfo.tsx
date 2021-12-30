import { useHistory } from "react-router-dom";
import { ITrack } from "../TrackPage";
import styles from "./TrackInfo.module.scss";

const TrackInfo = ({ track }: { track: ITrack }) => {
  // 트랙 제목/아티스트
  const history = useHistory();
  const clickUsername = () => history.push(`/${track.artist}`);

  return (
    <div className={styles.soundTitle}>
      <div className={styles.titleContainer}>{track.title}</div>
      <div className={styles.usernameContainer} onClick={clickUsername}>
        {track.artist}
      </div>
    </div>
  );
};

export default TrackInfo;
