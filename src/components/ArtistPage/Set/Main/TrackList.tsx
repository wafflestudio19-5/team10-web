import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useAuthContext } from "../../../../context/AuthContext";
import { useTrackContext } from "../../../../context/TrackContext";
import { IPlaylist, ISetTrack } from "../SetPage";
import styles from "./TrackList.module.scss";

const TrackList = ({
  track,
  playlist,
}: {
  track: ISetTrack;
  playlist: IPlaylist;
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
      } else {
        audioPlayer.current.pause();
        setPlay(false);
        setTrackIsPlaying(false);
      }
    }
  };

  const index = playlist.tracks.findIndex((element) => element.id === track.id);
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
        <span className={styles.artistName}>{track.artist} -</span>
        &nbsp;
        <span className={styles.trackTitle}>{track.title}</span>
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
