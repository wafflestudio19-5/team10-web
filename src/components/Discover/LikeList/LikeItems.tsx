import styles from "./LikeItem.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useState } from "react";
import { BsFillPlayFill, BsThreeDots } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";

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
            &nbsp; {count}
          </div>
          <div className={styles.likeCount}>
            <AiFillHeart />
            &nbsp; {like}
          </div>
          <div className={styles.commentCount}>
            <FaCommentAlt />
            &nbsp; {comment}
          </div>
          <div className={styles.repostCount}>
            <BiRepost />
            &nbsp; {repost}
          </div>
        </div>
      </div>
      <div className={styles.hover}>
        {play ? (
          <>
            <div className={styles.playButton}>
              <IoMdPause onClick={handlePlay} />
            </div>
            <div className={styles.functions}>
              <AiFillHeart className={styles.like} />
              <BsThreeDots className={styles.details} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.playButton}>
              <IoMdPlay onClick={handlePlay} />
            </div>
            <div className={styles.functions}>
              <AiFillHeart className={styles.like} />
              <BsThreeDots className={styles.details} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default LikeItems;
