import React from "react";
import styles from "./SideTracks.module.scss";
import { MdFeaturedPlayList } from "react-icons/md";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";

const InPlaylists = () => {
  const playlists = [
    {
      artistName: "Artist Name",
      trackName: "Playlist Name",
      likes: "25.2K",
      reposts: "1,614",
    },
    {
      artistName: "Artist Name",
      trackName: "Playlist Name",
      likes: "25.2K",
      reposts: "1,614",
    },
    {
      artistName: "Artist Name",
      trackName: "Playlist Name",
      likes: "25.2K",
      reposts: "1,614",
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div>
          <MdFeaturedPlayList />
          <span>In Playlists</span>
        </div>
        <span className={styles.viewAll}>View all</span>
      </div>
      <ul className={styles.trackList}>
        {playlists.map((playlist) => {
          return (
            <li className={styles.tracks}>
              <div className={styles.trackImage} />
              <div className={styles.trackInfo}>
                <span className={styles.artistName}>{playlist.artistName}</span>
                <span className={styles.trackName}>{playlist.trackName}</span>
                <div className={styles.miniStats}>
                  <div className={styles.statContainer}>
                    <div>
                      <BsSuitHeartFill />
                      <span>{playlist.likes}</span>
                    </div>
                  </div>
                  <div className={styles.statContainer}>
                    <div>
                      <BiRepost />
                      <span>{playlist.reposts}</span>
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

export default InPlaylists;
