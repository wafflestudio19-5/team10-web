import React from "react";
import styles from "./ListenArtistInfo.module.scss";
import { BsPeopleFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { RiUserFollowFill } from "react-icons/ri";
import { MdReport } from "react-icons/md";
import { useHistory } from "react-router";

const ListenArtistInfo = () => {
  const followers = 6048;
  const tracks = 49;
  const history = useHistory();
  const username = "username";
  const clickUsername = () => history.push(`/${username}`);
  const clickFollowers = () => history.push(`/${username}/followers`);
  const clickTracks = () => history.push(`/${username}/tracks`);
  return (
    <div className={styles.main}>
      <div className={styles.profileImg} onClick={clickUsername}></div>
      <div className={styles.username} onClick={clickUsername}>
        Username
      </div>
      <ul className={styles.userInfo}>
        <li onClick={clickFollowers}>
          <BsPeopleFill />
          <span>{followers}</span>
        </li>
        <li onClick={clickTracks}>
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
