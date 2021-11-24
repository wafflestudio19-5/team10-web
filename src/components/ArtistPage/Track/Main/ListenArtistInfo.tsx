import React from "react";
import styles from "./ListenArtistInfo.module.scss";
import { BsPeopleFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { RiUserFollowFill } from "react-icons/ri";
import { MdReport } from "react-icons/md";

const ListenArtistInfo = () => {
  const followers = 6048;
  const tracks = 49;
  return (
    <div className={styles.main}>
      <div className={styles.profileImg}></div>
      <div className={styles.username}>Username</div>
      <ul className={styles.userInfo}>
        <li>
          <BsPeopleFill />
          <span>{followers}</span>
        </li>
        <li>
          <IoStatsChart />
          <span>{tracks}</span>
        </li>
      </ul>
      <button>
        <RiUserFollowFill />
        <span>Follow</span>
      </button>
      <a>
        <MdReport />
        <span>Report</span>
      </a>
    </div>
  );
};

export default ListenArtistInfo;
