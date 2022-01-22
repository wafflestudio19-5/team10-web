import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useHistory } from "react-router";
import { useAuthContext } from "../../../../context/AuthContext";
import { useTrackContext } from "../../../../context/TrackContext";
import { IPlaylist, ISetTrack } from "../SetPage";
import styles from "./TrackList.module.scss";

const TrackList = ({
  track,
  playlist,
  playing,
}: {
  track: ISetTrack;
  playlist: IPlaylist;
  playing: string;
}) => {
  const [play, setPlay] = useState(false);
  const { userSecret } = useAuthContext();
  const {
    audioSrc,
    trackIsPlaying,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarTrack,
    // setTrackBarArtist,
    setTrackIsPlaying,
    setTrackBarPlaylist,
    // trackBarPlaylist,
  } = useTrackContext();
  const history = useHistory();
  const headerTrackSrc = track.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];

  useEffect(() => {
    if (headerTrackSrc === barTrackSrc && trackIsPlaying) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  }, [audioSrc, trackIsPlaying]);
  const togglePlayButton = () => {
    if (track && userSecret.permalink) {
      if (!play) {
        if (
          headerTrackSrc !== barTrackSrc &&
          typeof userSecret.id === "number"
        ) {
          setPlayingTime(0);
          audioPlayer.current.src = track.audio;
          setAudioSrc(track.audio);
          audioPlayer.current.load();
          //   setTrackBarArtist({
          //     display_name: username,
          //     id: userSecret.id,
          //     permalink: userSecret.permalink,
          //   });
          setTrackBarTrack(track);
        }
        setPlay(true);
        setTrackIsPlaying(true);
        setTimeout(() => {
          audioPlayer.current.play();
        }, 1);
        if (playing === "before") {
          setTrackBarPlaylist(playlist.tracks);
        }
      } else {
        audioPlayer.current.pause();
        setPlay(false);
        setTrackIsPlaying(false);
      }
    }
  };
  const index = playlist.tracks.findIndex((element) => element.id === track.id);
  const clickArtist = () => history.push(`/${track.artist}`);
  const clickTrack = () => history.push(`/${track.artist}/${track.permalink}`);
  return (
    <li className={styles.main} key={track.id}>
      <div className={styles.image}>
        <img src={track.image || "/default_track_image.svg"} />
        <div className={styles.playButton} onClick={togglePlayButton}>
          {play ? <IoMdPause /> : <IoMdPlay />}
        </div>
      </div>
      <div className={styles.index}>{index + 1}</div>
      <div className={styles.content}>
        <span className={styles.artistName} onClick={clickArtist}>
          {track.artist} -
        </span>
        &nbsp;
        <span className={styles.trackTitle} onClick={clickTrack}>
          {track.title}
        </span>
      </div>
      <div className={styles.count}>
        <span>
          <FaPlay />
          &nbsp;{track.count}
        </span>
      </div>
    </li>
  );
};

export default TrackList;
