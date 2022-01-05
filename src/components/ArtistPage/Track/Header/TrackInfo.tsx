import { useHistory } from "react-router-dom";
import { IArtist, ITrack } from "../TrackPage";
import styles from "./TrackInfo.module.scss";

const TrackInfo = ({ track, artist }: { track: ITrack; artist: IArtist }) => {
  // 트랙 제목/아티스트
  const history = useHistory();
  const clickUsername = () => history.push(`/${artist.permalink}`);

  return (
    <div className={styles.soundTitle}>
      <div className={styles.titleContainer}>{track.title}</div>
      <div className={styles.usernameContainer} onClick={clickUsername}>
        {artist.display_name}
      </div>
    </div>
  );
};

export default TrackInfo;
