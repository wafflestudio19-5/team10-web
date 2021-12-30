import React from "react";
import styles from "./ListenArtistInfo.module.scss";
import { BsPeopleFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { RiUserFollowFill } from "react-icons/ri";
import { MdReport } from "react-icons/md";
import { useHistory } from "react-router";
// import axios from "axios";

// interface ArtistInfo {
//   name: string;
//   image: string;
//   followers: number;
//   tracks: number;
// }
const ListenArtistInfo = ({ artist }: { artist: string }) => {
  const artistInfo = {
    name: artist,
    image:
      "https://images.unsplash.com/photo-1621841019942-2a8c701ebc30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fG11c2ljaWFufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    followers: 6429,
    tracks: 46,
  };
  const history = useHistory();
  const username = "username";
  const clickUsername = () => history.push(`/${username}`);
  const clickFollowers = () => history.push(`/${username}/followers`);
  const clickTracks = () => history.push(`/${username}/tracks`);

  const followUser = async () => {
    // try {
    //   const response = await axios.post(
    //     `https://api.soundwaffle.com/users/{user_id}/followings`
    //   );
    //   console.log(response);
    // } catch (error) {
    //   console.log(console.error());
    // }
    return;
  };

  return (
    <div className={styles.main}>
      <div className={styles.profileImg} onClick={clickUsername}>
        <img src={artistInfo.image} alt={`${artistInfo.name}의 프로필 사진`} />
      </div>
      <div className={styles.username} onClick={clickUsername}>
        {artistInfo.name}
      </div>
      <ul className={styles.userInfo}>
        <li onClick={clickFollowers}>
          <BsPeopleFill />
          <span>{artistInfo.followers}</span>
        </li>
        <li onClick={clickTracks}>
          <IoStatsChart />
          <span>{artistInfo.tracks}</span>
        </li>
      </ul>
      <button onClick={followUser}>
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
