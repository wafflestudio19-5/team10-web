import { useHistory } from "react-router-dom";
import { IPlaylist } from "../SetPage";
import styles from "./SetInfo.module.scss";

const SetInfo = ({ playlist }: { playlist: IPlaylist }) => {
  const history = useHistory();
  const clickUsername = () => history.push(`/${playlist.creator.permalink}`);

  return (
    <div className={styles.soundTitle}>
      <div className={styles.titleContainer}>{playlist.title}</div>
      <div className={styles.usernameContainer} onClick={clickUsername}>
        {playlist.creator.display_name}
      </div>
    </div>
  );
};

export default SetInfo;
