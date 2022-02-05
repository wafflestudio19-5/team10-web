import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserFriends } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import styles from "./Follower.module.scss";

const Follower = ({
  img,
  id,
  display_name,
  permalink,
  follower_count,
  followerList,
  fetchFollowingList,
}: {
  img: string;
  id: number;
  display_name: string;
  permalink: string;
  follower_count: number;
  followerList: any;
  fetchFollowingList: any;
}) => {
  const [follow, setFollow] = useState(true);
  const { userSecret } = useAuthContext();
  useEffect(() => {
    if (followerList[0].id !== -1) {
      const followIdList = followerList.map((item: any) => item.id);
      followIdList.includes(id) ? setFollow(true) : setFollow(false);
    }
  }, [followerList]);
  const history = useHistory();
  const goArtist = () => history.push(`/${permalink}`);
  const handleFollow = async (e: any) => {
    e.stopPropagation();
    if (follow === false) {
      await axios({
        method: "post",
        url: `/users/me/followings/${id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("팔로우에 실패하였습니다"));
      setFollow(!follow);
    } else {
      await axios({
        method: "delete",
        url: `/users/me/followings/${id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("팔로우에 실패하였습니다"));
      setFollow(!follow);
    }
    fetchFollowingList();
  };

  return (
    <div className={styles.wrapper}>
      {img === null ? (
        <img
          src="https://avatars.slack-edge.com/2021-11-21/2752177994355_754017ae7a70bee45092_192.png"
          alt="artist img"
          className={styles.image}
          onClick={goArtist}
        />
      ) : (
        <img
          src={img}
          alt="artist img"
          className={styles.image}
          onClick={goArtist}
        />
      )}
      <Link className={styles.link} to={`/${permalink}`}>
        {display_name}
      </Link>
      <div className={styles.follower_count}>
        <FaUserFriends className={styles.followers} /> {follower_count}{" "}
        followers
      </div>
      <button className={styles.button} onClick={handleFollow}>
        <RiUserFollowFill className={styles.followed} /> Following
      </button>
    </div>
  );
};

export default Follower;
