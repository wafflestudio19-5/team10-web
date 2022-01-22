// import { useHistory } from "react-router-dom";
import { ITrack } from "../TrackPage";
import styles from "./TrackTag.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const TrackTag = ({ track }: { track: ITrack }) => {
  //   const history = useHistory();
  //   const clickTag = () => history.push(`/tags/${track.tags[0]}`);
  const releasedDate = dayjs(track.created_at).fromNow();
  console.log(track.tags);
  return (
    <div className={styles.titleInfo}>
      <div className={styles.releasedDate}>{releasedDate}</div>
      {track.tags.length === 0 || (
        <div>
          <span
            className={styles.tag}
            //   onClick={clickTag}
          >
            {`${" "} #${track.tags[0]} ${" "}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default TrackTag;
