import React from "react";
import styles from "./SideTracks.module.scss";
import { MdFeaturedPlayList } from "react-icons/md";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { useHistory } from "react-router";

const InPlaylists = () => {
  const playlists = [
    {
      artistName: "Artist Name",
      listName: "Playlist Name",
      likes: "25.2K",
      reposts: "1,614",
    },
    {
      artistName: "Artist Name",
      listName: "Playlist Name",
      likes: "25.2K",
      reposts: "1,614",
    },
    {
      artistName: "Artist Name",
      listName: "Playlist Name",
      likes: "25.2K",
      reposts: "1,614",
    },
  ];
  const history = useHistory();
  return (
    <div className={styles.container}>
      <div
        className={styles.title}
        onClick={() => history.push(`username/trackname/sets`)}
      >
        <div>
          <MdFeaturedPlayList />
          <span>In Playlists</span>
        </div>
        <span className={styles.viewAll}>View all</span>
      </div>
      <ul className={styles.trackList}>
        {playlists.map((playlist) => {
          const clickUsername = () => history.push(`/${playlist.artistName}`);
          const clickPlaylist = () => history.push(`/${playlist.listName}`);
          return (
            <li className={styles.tracks}>
              <div
                className={styles.trackImage}
                onClick={() => history.push(`${playlist.listName}`)}
              />
              <div className={styles.trackInfo}>
                <span className={styles.artistName} onClick={clickUsername}>
                  {playlist.artistName}
                </span>
                <span className={styles.trackName} onClick={clickPlaylist}>
                  {playlist.listName}
                </span>
                <div className={styles.miniStats}>
                  <div className={styles.statContainer}>
                    <div className={styles.pointer}>
                      <BsSuitHeartFill />
                      <span>{playlist.likes}</span>
                    </div>
                  </div>
                  <div className={styles.statContainer}>
                    <div className={styles.pointer}>
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
