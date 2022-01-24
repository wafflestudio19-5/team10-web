import { BsPeopleFill } from "react-icons/bs";
// import { RiUserFollowFill, RiUserUnfollowLine } from "react-icons/ri";
import { useHistory } from "react-router";
import { IPlaylist } from "../SetPage";
import styles from "./CreatorInfo.module.scss";
const CreatorInfo = ({
  //   isMySet,
  playlist,
}: {
  //   isMySet: boolean | undefined;
  playlist: IPlaylist;
}) => {
  const history = useHistory();
  const clickUsername = () => history.push(`/${playlist.creator.permalink}`);
  return (
    <div className={styles.main}>
      <div className={styles.profileImg} onClick={clickUsername}>
        <img
          src={playlist.creator.image_profile || "/default_user_image.png"}
          alt={`${playlist.creator.display_name}의 프로필 사진`}
        />
      </div>
      <div className={styles.username} onClick={clickUsername}>
        {playlist.creator.display_name}
      </div>
      <ul className={styles.userInfo}>
        <li
        // onClick={clickFollowers}
        >
          <BsPeopleFill />
          <span>{playlist.creator.follower_count}</span>
        </li>
        {/* <li
        // onClick={clickTracks}
        >
          <IoStatsChart />
          <span>{artistInfo.tracks}</span>
        </li> */}
      </ul>
      {/* {isMySet === false && playlist.creator.is && (
        <button className={styles.unfollowArtist} onClick={unfollowUser}>
          <RiUserUnfollowLine />
          <span>Following</span>
        </button>
      )}
      {isMySet === false && !followArtist && (
        <button
          className={styles.followArtist}
          onClick={followUser}
          disabled={followLoading}
        >
          <RiUserFollowFill />
          <span>Follow</span>
        </button>
      )} */}
    </div>
  );
};
export default CreatorInfo;
