import React from "react";
import styles from "./ListenEngagement.module.scss";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { ImShare } from "react-icons/im";
import { FiLink2, FiMoreHorizontal } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";

const ListenEngagement = ({
  likes,
  reposts,
}: {
  likes: number;
  reposts: number;
}) => {
  return (
    <div className={styles.main}>
      <div className={styles.buttonGroup}>
        <button className={styles.like}>
          <BsSuitHeartFill />
          <span>Like</span>
        </button>
        <button className={styles.repost}>
          <BiRepost />
          <span>Repost</span>
        </button>
        <button className={styles.share}>
          <ImShare />
          <span>Share</span>
        </button>
        <button className={styles.copyLink}>
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
          <span>2.69M</span>
        </div>
        <div className={styles.likeStats}>
          <BsSuitHeartFill />
          <span className={styles.pointer}>{likes}</span>
        </div>
        <div className={styles.repostStats}>
          <BiRepost />
          <span className={styles.pointer}>{reposts}</span>
        </div>
      </div>
    </div>
  );
};

export default ListenEngagement;
