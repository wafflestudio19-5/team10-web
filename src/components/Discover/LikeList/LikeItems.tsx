import styles from "./LikeItem.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useState } from "react";
import { FcComments, FcLike } from "react-icons/fc";
import { BsFillPlayFill, BsThreeDots } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";

const LikeItems = ({
  title,
  img,
  artist,
  count,
  like,
  comment,
  repost,
}: {
  title: string;
  img: string;
  artist: string;
  count: number;
  like: number;
  comment: number;
  repost: number;
}) => {
  const [play, setPlay] = useState(false);
  const handlePlay = () => setPlay(!play);

  return (
    <div className={styles.itemWrapper}>
      <div className={styles.imgWrapper}>
        <img src={img} alt="trackImg" className={styles.img} />
      </div>
      <div className={styles.description}>
        <div className={styles.artist}>{artist}</div>
        <div className={styles.trackName}>{title}</div>
        <div className={styles.counts}>
          <div className={styles.playCount}>
            <BsFillPlayFill />
            {count}
          </div>
          <div className={styles.likeCount}>
            <FcLike />
            {like}
          </div>
          <div className={styles.commentCount}>
            <FcComments />
            {comment}
          </div>
          <div className={styles.repostCount}>
            <BiRepost />
            {repost}
          </div>
        </div>
      </div>
      <div className={styles.hover} onClick={handlePlay}>
        {play ? (
          <>
            <div className={styles.playButton}>
              <IoMdPause />
            </div>
            <div className={styles.functions}>
              <FcLike className={styles.like} />
              <BsThreeDots className={styles.details} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.playButton}>
              <IoMdPlay />
            </div>
            <div className={styles.functions}>
              <FcLike className={styles.like} />
              <BsThreeDots className={styles.details} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default LikeItems;
