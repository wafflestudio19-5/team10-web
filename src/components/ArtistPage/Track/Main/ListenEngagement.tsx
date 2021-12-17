import React, { useState } from "react";
import styles from "./ListenEngagement.module.scss";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { ImShare } from "react-icons/im";
import { FiLink2, FiMoreHorizontal } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { ITrack } from "../TrackPage";
import { useHistory } from "react-router-dom";
// import axios from "axios";

const ListenEngagement = ({ track }: { track: ITrack }) => {
  const [like, setLike] = useState(false);

  const history = useHistory();

  const likeTrack = async () => {
    // try {
    //   const response = await axios.post(
    //     `https://api.soundwaffle.com/likes/tracks/track_id`
    //   );
    //   console.log(response);
    //   setLike(true)
    // } catch (error) {
    //   console.log(error);
    // }
    setLike(true);
  };
  const unlikeTrack = async () => {
    // try {
    //   const response = await axios.delete(
    //     `https://api.soundwaffle.com/likes/tracks/track_id`
    //   );
    //   console.log(response);
    //   setLike(false);
    // } catch (error) {
    //   console.log(error);
    // }
    setLike(false);
  };
  const repostTrack = async () => {
    // try {
    //   const response = await axios.post(
    //     `https://api.soundwaffle.com/reposts/tracks/track_id`
    //   );
    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }
    return;
  };
  const copyLink = async () => {
    await navigator.clipboard.writeText(location.href);
    console.log("success");
  };

  const trackLikes = () => history.push(`/username/trackname/likes`);
  const trackReposts = () => history.push(`/username/trackname/reposts`);

  console.log(like);

  return (
    <div className={styles.main}>
      <div className={styles.buttonGroup}>
        {like ? (
          <button className={styles.like} onClick={unlikeTrack}>
            <BsSuitHeartFill />
            <span>Liked</span>
          </button>
        ) : (
          <button className={styles.notLike} onClick={likeTrack}>
            <BsSuitHeartFill />
            <span>Like</span>
          </button>
        )}
        <button className={styles.repost} onClick={repostTrack}>
          <BiRepost />
          <span>Repost</span>
        </button>
        <button className={styles.share}>
          <ImShare />
          <span>Share</span>
        </button>
        <button className={styles.copyLink} onClick={copyLink}>
          <FiLink2 />
          <span>Copy Link</span>
        </button>
        <button className={styles.more}>
          <FiMoreHorizontal />
          <span>More</span>
        </button>
      </div>
      <div className={styles.stats}>
        <div className={styles.playStats}>
          <FaPlay />
          <span>{track.count}</span>
        </div>
        <div className={styles.likeStats}>
          <BsSuitHeartFill />
          <span className={styles.pointer} onClick={trackLikes}>
            {track.likes}
          </span>
        </div>
        <div className={styles.repostStats}>
          <BiRepost />
          <span className={styles.pointer} onClick={trackReposts}>
            {track.reposts}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListenEngagement;
