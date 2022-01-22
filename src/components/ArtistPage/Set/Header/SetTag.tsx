import styles from "./SetTag.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IPlaylist } from "../SetPage";
dayjs.extend(relativeTime);

const SetTag = ({ playlist }: { playlist: IPlaylist }) => {
  const releasedDate = dayjs(playlist.created_at).fromNow();
  console.log(playlist.tags);
  return (
    <div className={styles.titleInfo}>
      <div className={styles.releasedDate}>{releasedDate}</div>
      {playlist.tags.length === 0 || (
        <div>
          <span
            className={styles.tag}
            //   onClick={clickTag}
          >
            {`${" "} #${playlist.tags[0].name} ${" "}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default SetTag;
