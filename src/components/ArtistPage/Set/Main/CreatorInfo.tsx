import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BsPeopleFill } from "react-icons/bs";
import { RiUserFollowFill, RiUserUnfollowLine } from "react-icons/ri";
import { useHistory } from "react-router";
import { useAuthContext } from "../../../../context/AuthContext";
import { IPlaylist } from "../SetPage";
import styles from "./CreatorInfo.module.scss";
const CreatorInfo = ({
  isMySet,
  playlist,
}: {
  isMySet: boolean | undefined;
  playlist: IPlaylist;
}) => {
  const { userSecret } = useAuthContext();
  const history = useHistory();
  const clickUsername = () => history.push(`/${playlist.creator.permalink}`);
  const followUser = async () => {
    const config: any = {
      method: "post",
      url: `/users/me/followings/${playlist.creator.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      await axios(config);
    } catch (error) {
      toast.error("실패했습니다");
      console.log(error);
    }
  };
  const unfollowUser = async () => {
    const config: any = {
      method: "delete",
      url: `/users/me/followings/${playlist.creator.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      await axios(config);
    } catch (error) {
      toast.error("실패했습니다");
      console.log(error);
    }
  };
  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_user_image.png";
  };
  return (
    <div className={styles.main}>
      <div className={styles.profileImg} onClick={clickUsername}>
        <img
          src={playlist.creator.image_profile || "/default_user_image.png"}
          onError={onImageError}
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
      {isMySet === false && playlist.is_followed && (
        <button
          className={styles.unfollowArtist}
          onClick={unfollowUser}
          disabled={playlist.is_followed === undefined}
        >
          <RiUserUnfollowLine />
          <span>Following</span>
        </button>
      )}
      {isMySet === false && playlist.is_followed === false && (
        <button
          className={styles.followArtist}
          onClick={followUser}
          disabled={playlist.is_followed === undefined}
        >
          <RiUserFollowFill />
          <span>Follow</span>
        </button>
      )}
    </div>
  );
};
export default CreatorInfo;
