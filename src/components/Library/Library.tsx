import { useHistory } from "react-router";
import styles from "./Library.module.scss";

const Library = () => {
  const history = useHistory();
  const goToSomewhere = (sth: string) => {
    history.push(sth);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.focus}>Overview</div>
        <div
          className={styles.others}
          onClick={() => goToSomewhere("/you/likes")}
        >
          Likes
        </div>
        <div
          className={styles.others}
          onClick={() => goToSomewhere("/you/sets")}
        >
          Playlists
        </div>
        <div
          className={styles.others}
          onClick={() => goToSomewhere("/you/albums")}
        >
          Albums
        </div>
        <div
          className={styles.others}
          onClick={() => goToSomewhere("/you/stations")}
        >
          Stations
        </div>
        <div
          className={styles.others}
          onClick={() => goToSomewhere("/you/following")}
        >
          Following
        </div>
        <div
          className={styles.others}
          onClick={() => goToSomewhere("/you/history")}
        >
          History
        </div>
      </div>
      <div className={styles.recent_played}>
        <p>Recent played</p>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={styles.likes}>
        <p>Likes</p>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={styles.playlists}>
        <p>Playlists</p>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={styles.albums}>
        <p>Albums</p>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={styles.liked_stations}>
        <p>Liked stations</p>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={styles.following}>
        <p>Following</p>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Library;