import React from "react";
import styles from "./SideUsers.module.scss";
import { BsSuitHeartFill } from "react-icons/bs";
import { useHistory } from "react-router";

const LikeUsers = () => {
  const history = useHistory();
  return (
    <div className={styles.container}>
      <div
        className={styles.title}
        onClick={() => history.push(`username/trackname/likes`)}
      >
        <div>
          <BsSuitHeartFill />
          <span>25.2 likes</span>
        </div>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.userImages}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map((index) => {
          const clickUser = () => history.push(`/username`);
          return (
            <div
              className={styles.image}
              style={{ zIndex: index }}
              onClick={clickUser}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LikeUsers;
