import React, { useEffect, useState } from "react";
import styles from "./SideTracks.module.scss";
import { MdFeaturedPlayList } from "react-icons/md";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { useHistory } from "react-router";
import { IPlaylist } from "../../../Set/SetPage";
import axios from "axios";
import { IArtist } from "../../TrackPage";

const InPlaylists = ({ artist }: { artist: IArtist }) => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  useEffect(() => {
    const fetchArtistPlaylists = async () => {
      if (artist.id != 0) {
        const config: any = {
          method: "get",
          url: `/users/${artist.id}/sets?page=1&page_size=3`,
          data: {},
        };
        try {
          const { data } = await axios(config);
          setPlaylists(data.results);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchArtistPlaylists();
  }, [artist.id]);

  const history = useHistory();
  return (
    <>
      {playlists.length !== 0 && (
        <div className={styles.container}>
          <div className={styles.title}>
            <div>
              <MdFeaturedPlayList />
              <span>Artist's Playlists</span>
            </div>
            <span className={styles.viewAll}>View all</span>
          </div>
          <ul className={styles.trackList}>
            {playlists.map((playlist: IPlaylist) => {
              const clickUsername = () => history.push(`/${artist.permalink}`);
              const clickPlaylist = () =>
                history.push(
                  `/${playlist.creator.permalink}/sets/${playlist.permalink}`
                );
              return (
                <li className={styles.tracks} key={playlist.id}>
                  <img
                    className={styles.trackImage}
                    src={playlist.image || "/default_track_image.svg"}
                    onClick={clickPlaylist}
                  />
                  <div className={styles.trackInfo}>
                    <span className={styles.artistName} onClick={clickUsername}>
                      {artist.display_name}
                    </span>
                    <span className={styles.trackName} onClick={clickPlaylist}>
                      {playlist.title}
                    </span>
                    <div className={styles.miniStats}>
                      <div className={styles.statContainer}>
                        <div className={styles.pointer}>
                          <BsSuitHeartFill />
                          <span>{playlist.like_count}</span>
                        </div>
                      </div>
                      <div className={styles.statContainer}>
                        <div className={styles.pointer}>
                          <BiRepost />
                          <span>{playlist.repost_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default InPlaylists;
