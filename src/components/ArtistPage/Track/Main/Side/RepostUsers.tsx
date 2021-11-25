import React from "react";
import styles from "./SideUsers.module.scss";
import { BiRepost } from "react-icons/bi";
import { useHistory } from "react-router";

const RepostUsers = () => {
  const history = useHistory();
  return (
    <div className={styles.container} style={{ marginBottom: "30px" }}>
      <div
        className={styles.title}
        onClick={() => history.push(`username/trackname/reposts`)}
      >
        <div>
          <BiRepost />
          <span>1,614 reposts</span>
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

export default RepostUsers;
