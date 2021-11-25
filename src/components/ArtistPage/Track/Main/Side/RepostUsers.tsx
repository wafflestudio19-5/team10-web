import React from "react";
import styles from "./SideUsers.module.scss";
import { BiRepost } from "react-icons/bi";

const RepostUsers = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div>
          <BiRepost />
          <span>1,614 reposts</span>
        </div>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.userImages}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map((index) => {
          return <div className={styles.image} style={{ zIndex: index }} />;
        })}
      </div>
    </div>
  );
};

export default RepostUsers;
