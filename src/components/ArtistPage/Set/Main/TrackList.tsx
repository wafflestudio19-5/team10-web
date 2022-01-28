import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiRepost } from "react-icons/bi";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FiLink2 } from "react-icons/fi";
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
  setPlaying,
  fetchSet,
}: {
  track: ISetTrack;
  playlist: IPlaylist;
  playing: string;
  setPlaying: React.Dispatch<React.SetStateAction<string>>;
  fetchSet: () => void;
}) => {
  const [play, setPlay] = useState(false);
  //   const [liked, setLiked] = useState(false);
  //   const [reposted, setReposted] = useState(false);
  const { userSecret } = useAuthContext();
  const {
    audioSrc,
    trackIsPlaying,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarTrack,
    setTrackBarArtist,
    setTrackIsPlaying,
    setTrackBarPlaylist,
    // trackBarPlaylist,
  } = useTrackContext();
  const history = useHistory();
  const headerTrackSrc = track.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];

  //   useEffect(() => {
  //     if (track.is_liked) {
  //       setLiked(true);
  //     }
  //     if (track.is_reposted) {
  //       setReposted(true);
  //     }
  //   }, [track.is_reposted, track.is_liked]);

  useEffect(() => {
    if (
      headerTrackSrc === barTrackSrc &&
      trackIsPlaying &&
      playing !== "before"
    ) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  }, [audioSrc, trackIsPlaying]);
  const putHit = async (id: number) => {
    const config: any = {
      method: "put",
      url: `/tracks/${id}/hit?set_id=${playlist.id}`,
      Authorization: userSecret.jwt,
      data: {},
    };
    try {
      await axios(config);
    } catch (error) {
      console.log(error);
    }
  };
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
          setTrackBarArtist({
            display_name: track.artist_display_name,
            id: track.artist,
            permalink: track.artist_permalink,
          });
          setTrackBarTrack(track);
        }
        setPlay(true);
        setTrackIsPlaying(true);
        setTimeout(() => {
          audioPlayer.current.play();
        }, 1);
        if (playing === "before") {
          setPlaying("playing");
          setAudioSrc(track.audio);
          audioPlayer.current.src = track.audio;
          setPlayingTime(0);
          audioPlayer.current.load();
          audioPlayer.current.play();
          setTrackBarPlaylist(playlist.tracks);
          putHit(track.id);
        }
      } else {
        audioPlayer.current.pause();
        setPlay(false);
        setTrackIsPlaying(false);
      }
    }
  };
  //   console.log(track);
  const index = playlist.tracks.findIndex((element) => element.id === track.id);
  const clickArtist = () => history.push(`/${track.artist_permalink}`);
  const clickTrack = () =>
    history.push(`/${track.artist_permalink}/${track.permalink}`);
  const likeTrack = async () => {
    const config: any = {
      method: track.is_liked ? "delete" : "post",
      url: `/likes/tracks/${track.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      await axios(config);
      fetchSet();
    } catch (error) {
      toast.error("실패했습니다");
    }
  };
  const repostTrack = async () => {
    const config: any = {
      method: track.is_reposted ? "delete" : "post",
      url: `/reposts/tracks/${track.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      await axios(config);
      fetchSet();
    } catch (error) {
      toast.error("실패했습니다");
    }
  };
  const copyLink = async () => {
    await navigator.clipboard.writeText(location.href);
    toast.success("Link has been copied to the clipboard!");
  };

  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_track_image.svg";
  };

  return (
    <li className={styles.main} key={track.id}>
      <div className={styles.image}>
        <img
          src={track.image || "/default_track_image.svg"}
          onError={onImageError}
        />
        <div className={styles.playButton} onClick={togglePlayButton}>
          {play ? <IoMdPause /> : <IoMdPlay />}
        </div>
      </div>
      <div className={styles.index}>{index + 1}</div>
      <div className={styles.content}>
        <span className={styles.artistName} onClick={clickArtist}>
          {track.artist_display_name} -
        </span>
        &nbsp;
        <span className={styles.trackTitle} onClick={clickTrack}>
          {track.title}
        </span>
      </div>
      <div className={styles.count}>
        <span>
          <FaPlay />
          &nbsp;{track.play_count}
        </span>
      </div>
      <div className={styles.reaction}>
        <button
          className={track.is_liked ? styles.liked : undefined}
          onClick={likeTrack}
        >
          <BsSuitHeartFill />
        </button>
        <button
          className={track.is_reposted ? styles.liked : undefined}
          onClick={repostTrack}
        >
          <BiRepost />
        </button>
        <button onClick={copyLink}>
          <FiLink2 />
        </button>
      </div>
    </li>
  );
};

export default TrackList;
