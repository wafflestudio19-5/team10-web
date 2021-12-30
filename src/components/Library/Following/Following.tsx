import { useHistory } from "react-router";
import styles from "./Following.module.scss";

const Following = () => {
  const history = useHistory();
  const goToSomewhere = (sth: string) => {
    history.push(sth);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div
          className={styles.others}
          onClick={() => goToSomewhere("/you/library")}
        >
          Overview
        </div>
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
        <div className={styles.focus}>Following</div>
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
    </div>
  );
};

export default Following;
