import React, { useEffect, useRef, useState } from "react";
import styles from "./TrackHeader.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useHistory } from "react-router";
// import AudioPlayer from "react-h5-audio-player";
import "./styles.scss";
import { ITrack } from "../TrackPage";

const TrackHeader = ({
  openModal,
  track,
}: {
  openModal: () => void;
  track: ITrack;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const history = useHistory();

  const { artist, tags } = track;
  const clickUsername = () => history.push(`/${artist}`);
  const clickTag = () => history.push(`/tags/${tags[0]}`);

  const audioPlayer = useRef<HTMLAudioElement>(new Audio());
  const progressBar = useRef<any>(null);
  const animationRef = useRef(0);

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [
    audioPlayer?.current?.onloadedmetadata,
    audioPlayer?.current?.readyState,
  ]);

  const onLoadedMetadata = () => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(audioPlayer.current.duration);
    progressBar.current.max = seconds;
  };

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  return (
    <div className={styles.trackHeader}>
      <div className={styles.trackInfo}>
        {isPlaying ? (
          <button className={styles.playButton} onClick={togglePlayPause}>
            <IoMdPause />
          </button>
        ) : (
          <button className={styles.playButton} onClick={togglePlayPause}>
            <IoMdPlay />
          </button>
        )}
        <div className={styles.soundTitle}>
          <div className={styles.titleContainer}>{track.title}</div>
          <div className={styles.usernameContainer} onClick={clickUsername}>
            {track.artist}
          </div>
        </div>
      </div>
      <div className={styles.playingTrack}>
        {/* <AudioPlayer
          className={styles.audioPlayer}
          src="https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"
          ref={playingAudio.current}
          layout="horizontal"
        /> */}
        <audio
          ref={audioPlayer}
          className={styles.audioPlayer}
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          preload="metadata"
          onLoadedMetadata={onLoadedMetadata}
        ></audio>
        <div className={styles.trackPlayer}>
          <div className={styles.time}>
            <div className={styles.currentTime}>
              {calculateTime(currentTime)}
            </div>
            <div className={styles.duration}>
              {duration && !isNaN(duration) && calculateTime(duration)}
            </div>
          </div>
          <div className={styles.barContainer}>
            <input
              ref={progressBar}
              type="range"
              className={styles.progressBar}
              defaultValue="0"
              onChange={changeRange}
              step="0.05"
            />
          </div>
        </div>
      </div>
      <div className={styles.titleInfo}>
        <div className={styles.releasedDate}>{track.created_at}</div>
        <div className={styles.tag} onClick={clickTag}>
          #{tags[0]}
        </div>
      </div>
      <div className={styles.albumImage} onClick={openModal}>
        {track.image ? (
          <img src={track.image} alt={`${track.title}의 트랙 이미지`} />
        ) : null}
      </div>
    </div>
  );
};

export default TrackHeader;
