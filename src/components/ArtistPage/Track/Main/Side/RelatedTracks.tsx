import React, { useState } from "react";
import styles from "./SideTracks.module.scss";
import { IoStatsChart } from "react-icons/io5";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { FcComments } from "react-icons/fc";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useHistory } from "react-router";

interface ITrack {
  artistName: string;
  trackName: string;
  plays: string;
  likes: string;
  reposts: string;
  comments: number;
}
const Track = ({ track }: { track: ITrack }) => {
  const [play, setPlay] = useState(false);
  const clickPlayButton = () => setPlay(!play);
  const history = useHistory();
  const clickUsername = () => history.push(`/${track.artistName}`);
  const clickTrack = () =>
    history.push(`/${track.artistName}/${track.trackName}`);
  return (
    <li className={styles.tracks}>
      <div className={styles.trackImage}>
        <div className={styles.playButton} onClick={clickPlayButton}>
          {play ? <IoMdPause /> : <IoMdPlay />}
        </div>
      </div>
      <div className={styles.trackInfo}>
        <span className={styles.artistName} onClick={clickUsername}>
          {track.artistName}
        </span>
        <span className={styles.trackName} onClick={clickTrack}>
          {track.trackName}
        </span>
        <div className={styles.miniStats}>
          <div className={styles.statContainer}>
            <div>
              <FaPlay />
              <span>{track.plays}</span>
            </div>
          </div>
          <div className={styles.statContainer}>
            <div className={styles.pointer}>
              <BsSuitHeartFill />
              <span>{track.likes}</span>
            </div>
          </div>
          <div className={styles.statContainer}>
            <div className={styles.pointer}>
              <BiRepost />
              <span>{track.reposts}</span>
            </div>
          </div>
          <div className={styles.statContainer}>
            <div className={styles.pointer}>
              <FcComments />
              <span>{track.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const RelatedTracks = () => {
  const relatedTracks = [
    {
      id: 1,
      artistName: "Artist Name",
      trackName: "Track Name",
      plays: "2.69M",
      likes: "25.2K",
      reposts: "1,614",
      comments: 163,
    },
    {
      id: 2,
      artistName: "Artist Name",
      trackName: "Track Name",
      plays: "2.69M",
      likes: "25.2K",
      reposts: "1,614",
      comments: 163,
    },
    {
      id: 3,
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
          return <Track track={track} key={track.id} />;
        })}
      </ul>
    </div>
  );
};

export default RelatedTracks;
