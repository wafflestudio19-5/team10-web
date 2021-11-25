import React from "react";
import styles from "./SideTracks.module.scss";
import { IoStatsChart } from "react-icons/io5";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { FcComments } from "react-icons/fc";

const RelatedTracks = () => {
  const relatedTracks = [
    {
      artistName: "Artist Name",
      trackName: "Track Name",
      plays: "2.69M",
      likes: "25.2K",
      reposts: "1,614",
      comments: 163,
    },
    {
      artistName: "Artist Name",
      trackName: "Track Name",
      plays: "2.69M",
      likes: "25.2K",
      reposts: "1,614",
      comments: 163,
    },
    {
      artistName: "Artist Name",
      trackName: "Track Name",
      plays: "2.69M",
      likes: "25.2K",
      reposts: "1,614",
      comments: 163,
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div>
          <IoStatsChart />
          <span>Related Tracks</span>
        </div>
        <span className={styles.viewAll}>View all</span>
      </div>
      <ul className={styles.trackList}>
        {relatedTracks.map((track) => {
          return (
            <li className={styles.tracks}>
              <div className={styles.trackImage} />
              <div className={styles.trackInfo}>
                <span className={styles.artistName}>{track.artistName}</span>
                <span className={styles.trackName}>{track.trackName}</span>
                <div className={styles.miniStats}>
                  <div className={styles.statContainer}>
                    <div>
                      <FaPlay />
                      <span>{track.plays}</span>
                    </div>
                  </div>
                  <div className={styles.statContainer}>
                    <div>
                      <BsSuitHeartFill />
                      <span>{track.likes}</span>
                    </div>
                  </div>
                  <div className={styles.statContainer}>
                    <div>
                      <BiRepost />
                      <span>{track.reposts}</span>
                    </div>
                  </div>
                  <div className={styles.statContainer}>
                    <div>
                      <FcComments />
                      <span>{track.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RelatedTracks;
