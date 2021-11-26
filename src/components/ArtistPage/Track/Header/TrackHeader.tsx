import React, { useRef, useState } from "react";
import styles from "./TrackHeader.module.scss";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useHistory } from "react-router";
// import ReactAudioPlayer from "react-audio-player";
import AudioPlayer from "react-h5-audio-player";
import "./styles.scss";

const TrackHeader = ({ openModal }: { openModal: () => void }) => {
  const [play, setPlay] = useState(false);
  const history = useHistory();
  const username = "username";
  const tags = ["Piano", "sad piano"];
  const clickUsername = () => history.push(`/${username}`);
  const clickTag = () => history.push(`/tags/${tags[0]}`);
  const playingAudio: any = useRef(null);
  //   const clickPlayButton = () => setPlay(!play);
  const clickPlayButton = () => {
    setPlay(true);
    playingAudio.current && playingAudio.current.play();
  };
  const clickPauseButton = () => {
    setPlay(false);
    console.log(play);
    playingAudio.current && playingAudio.current.pause();
  };
  return (
    <div className={styles.trackHeader}>
      <div className={styles.trackInfo}>
        <button className={styles.playButton} onClick={clickPlayButton}>
          {play ? (
            <IoMdPause onClick={clickPauseButton} />
          ) : (
            <IoMdPlay onClick={clickPlayButton} />
          )}
        </button>
        <div className={styles.soundTitle}>
          <div className={styles.titleContainer}>Title</div>
          <div className={styles.usernameContainer} onClick={clickUsername}>
            username
          </div>
        </div>
      </div>
      <div className={styles.playingTrack}>
        <AudioPlayer
          className={styles.audioPlayer}
          src="https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"
          ref={playingAudio.player}
          showJumpControls={false}
          showDownloadProgress={false}
          layout="horizontal"
        />
      </div>
      <div className={styles.titleInfo}>
        <div className={styles.releasedDate}>1 year ago</div>
        <div className={styles.tag} onClick={clickTag}>
          #{tags[0]}
        </div>
      </div>
      <div className={styles.albumImage} onClick={openModal} />
    </div>
  );
};

export default TrackHeader;
