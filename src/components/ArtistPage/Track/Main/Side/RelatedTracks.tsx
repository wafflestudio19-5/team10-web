import React, { useEffect, useState } from "react";
import styles from "./SideTracks.module.scss";
import { IoStatsChart } from "react-icons/io5";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { FcComments } from "react-icons/fc";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useHistory } from "react-router";
import { IArtist, ITrack } from "../../TrackPage";
import axios from "axios";
import { useTrackContext } from "../../../../../context/TrackContext";

const Track = ({ track, artist }: { track: ITrack; artist: IArtist }) => {
  const [play, setPlay] = useState(false);
  const {
    audioSrc,
    trackIsPlaying,
    audioPlayer,
    setTrackBarPlaylist,
    setPlayingTime,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    setTrackIsPlaying,
  } = useTrackContext();
  const headerTrackSrc = track.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];

  useEffect(() => {
    if (headerTrackSrc === barTrackSrc && trackIsPlaying) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  }, [audioSrc, trackIsPlaying, audioPlayer.current.src]);
  const togglePlayButton = () => {
    if (track) {
      setTrackBarPlaylist([]);
      if (!play) {
        if (headerTrackSrc !== barTrackSrc) {
          setPlayingTime(0);
          audioPlayer.current.src = track.audio;
          setAudioSrc(track.audio);
          audioPlayer.current.load();
          setTrackBarArtist({
            display_name: artist.display_name,
            id: artist.id,
            permalink: artist.permalink,
          });
          setTrackBarTrack(track);
        }
        setPlay(true);
        setTrackIsPlaying(true);
        setTimeout(() => {
          audioPlayer.current.play();
        }, 1);
      } else {
        audioPlayer.current.pause();
        setPlay(false);
        setTrackIsPlaying(false);
      }
    }
  };
  const history = useHistory();
  const clickUsername = () => history.push(`/${artist.permalink}`);
  const clickTrack = () =>
    history.push(`/${artist.permalink}/${track.permalink}`);
  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_track_image.svg";
  };

  return (
    <li className={styles.tracks}>
      <div className={styles.trackImage}>
        <img
          src={track.image || "/default_track_image.svg"}
          onError={onImageError}
        />
        <div className={styles.playButton} onClick={togglePlayButton}>
          {play ? <IoMdPause /> : <IoMdPlay />}
        </div>
      </div>
      <div className={styles.trackInfo}>
        <span className={styles.artistName} onClick={clickUsername}>
          {artist.display_name}
        </span>
        <span className={styles.trackName} onClick={clickTrack}>
          {track.title}
        </span>
        <div className={styles.miniStats}>
          <div className={styles.statContainer}>
            <div>
              <FaPlay />
              <span>{track.play_count}</span>
            </div>
          </div>
          <div className={styles.statContainer}>
            <div className={styles.pointer}>
              <BsSuitHeartFill />
              <span>{track.like_count}</span>
            </div>
          </div>
          <div className={styles.statContainer}>
            <div className={styles.pointer}>
              <BiRepost />
              <span>{track.repost_count}</span>
            </div>
          </div>
          <div className={styles.statContainer}>
            <div className={styles.pointer}>
              <FcComments />
              <span>{track.comment_count}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const RelatedTracks = ({
  artist,
  track,
}: {
  artist: IArtist;
  track: ITrack;
}) => {
  const [artistTrack, setArtistTrack] = useState<ITrack[]>([]);
  useEffect(() => {
    const fetchArtistTracks = async () => {
      if (artist.id != 0) {
        const config: any = {
          method: "get",
          url: `/users/${artist.id}/tracks?page=1&page_size=4`,
          data: {},
        };
        try {
          const { data } = await axios(config);
          const tracks = data.results.filter(
            (result: ITrack) => result.id !== track.id
          );
          setArtistTrack(tracks.slice(0, 3));
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchArtistTracks();
  }, [artist.id]);

  return (
    <>
      {artistTrack.length !== 0 && (
        <div className={styles.container}>
          <div className={styles.title}>
            <div>
              <IoStatsChart />
              <span>Artist's Recent Tracks</span>
            </div>
            <span className={styles.viewAll}>View all</span>
          </div>
          <ul className={styles.trackList}>
            {artistTrack.map((track: ITrack) => {
              return <Track track={track} artist={artist} key={track.id} />;
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default RelatedTracks;
