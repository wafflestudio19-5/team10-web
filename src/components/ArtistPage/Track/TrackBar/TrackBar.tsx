import styles from "./TrackBar.module.scss";
import {
  IoPlaySkipBackSharp,
  IoPlaySharp,
  IoPauseSharp,
  IoPlaySkipForwardSharp,
  IoShuffleSharp,
} from "react-icons/io5";
import { BiRepeat } from "react-icons/bi";
import { BsFillSuitHeartFill } from "react-icons/bs";
import {
  RiUserFollowFill,
  RiUserUnfollowFill,
  RiVolumeMuteFill,
} from "react-icons/ri";
import { MdVolumeUp, MdPlaylistPlay } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTrackContext } from "../../../../context/TrackContext";
// import axios from "axios";

const TrackBar = () => {
  const [likeTrack, setLikeTrack] = useState(false);
  const [followArtist, setFollowArtist] = useState(false);

  const {
    trackDuration,
    trackIsPlaying,
    setTrackIsPlaying,
    playingTime,
    setPlayingTime,
    audioPlayer,
    isMuted,
    setIsMuted,
    loop,
    setLoop,
  } = useTrackContext();

  const history = useHistory();

  //   const audioPlayer = useRef<HTMLAudioElement>(new Audio());
  const progressBar = useRef<any>(null); // 재생 바 태그 접근(input)
  const barAnimationRef = useRef(0); // 재생 애니메이션

  const calculateTime = (secs: number) => {
    // 트랙 길이를 분:초 단위로 환산
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value; // input slider와 트랙 연결
    setPlayingTime(audioPlayer.current.currentTime);
    changePlayerCurrentTime();
  };

  const togglePlayPause = () => {
    // 재생/일시정지 버튼 누를 때
    const prevValue = trackIsPlaying;
    setTrackIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      setPlayingTime(audioPlayer.current.currentTime);
      barAnimationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      setPlayingTime(audioPlayer.current.currentTime);
      cancelAnimationFrame(barAnimationRef.current);
    }
  };

  const whilePlaying = () => {
    setPlayingTime(progressBar.current.value);
    changePlayerCurrentTime();
    barAnimationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changePlayerCurrentTime = () => {
    if (progressBar.current && audioPlayer.current) {
      progressBar.current.value = audioPlayer.current.currentTime;
      // 재생 바에 슬라이더가 있는 곳까지 색을 바꾸기 위함
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(audioPlayer.current.currentTime / trackDuration) * 100}%`
      );
    }
    setPlayingTime(audioPlayer.current.currentTime);
  };

  useEffect(() => {
    changePlayerCurrentTime();
  }, [playingTime]);

  const onPlayerClick = () => {
    // 재생 바 아무곳이나 누르면 일시정지 상태였더라도 재생되도록 함
    setTrackIsPlaying(true);
    setPlayingTime(progressBar.current.value);
    audioPlayer.current.play();
    barAnimationRef.current = requestAnimationFrame(whilePlaying);
  };

  const toggleLoop = () => setLoop(!loop);
  const toggleMuteUnmute = () => setIsMuted(!isMuted);

  const clickArtist = () => history.push(`/username`);
  const clickTrack = () => history.push(`/username/trackname`);

  const onLikeTrack = async () => {
    // try {
    //   const response = await axios.post(
    //     `https://api.soundwaffle.com/likes/tracks/track_id`
    //   );
    //   console.log(response);
    //   setLike(true)
    // } catch (error) {
    //   console.log(error);
    // }
    setLikeTrack(true);
  };
  const unlikeTrack = async () => {
    // try {
    //   const response = await axios.delete(
    //     `https://api.soundwaffle.com/likes/tracks/track_id`
    //   );
    //   console.log(response);
    //   setLike(false);
    // } catch (error) {
    //   console.log(error);
    // }
    setLikeTrack(false);
  };

  const onFollowArtist = async () => {
    // try {
    //   const response = await axios.post(
    //     `https://api.soundwaffle.com/resolve?url=https://soundwaffle.com/user/xdlcfiw69486/follow&client_id=eok6x7k4bef2`,
    //     {
    //       headers: {
    //         Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMSwidXNlcm5hbWUiOiJhbmRobDIwNEBzb3VuZHdhZmZsZS5jb20iLCJleHAiOjE2Mzk4NTIzNDYsImVtYWlsIjoiYW5kaGwyMDRAc291bmR3YWZmbGUuY29tIiwib3JpZ19pYXQiOjE2Mzk4NDUxNDZ9.t__NMUozOtcOiZfpDRmCQNTo_1A91gOi3MVlFRayRYM`,
    //       },
    //     }
    //   );
    //   console.log(response);
    //   setFollowArtist(true);
    // } catch (error) {
    //   console.log(error);
    // }
    setFollowArtist(true);
  };
  const unfollowArtist = async () => {
    //   try {
    //       const response = await axios.delete(`https://api.soundwaffle.com/users/{user_id}/follow`)
    //       console.log(response)
    //       setFollowArtist(false)
    //   } catch(error) {
    //       console.log(error)
    //   }
    setFollowArtist(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <button className={styles.previousTrack}>
          <IoPlaySkipBackSharp />
        </button>
        {trackIsPlaying ? (
          <button className={styles.playButton} onClick={togglePlayPause}>
            <IoPauseSharp />
          </button>
        ) : (
          <button className={styles.playButton} onClick={togglePlayPause}>
            <IoPlaySharp />
          </button>
        )}
        <button className={styles.nextTrack}>
          <IoPlaySkipForwardSharp />
        </button>
        <button className={styles.shuffle}>
          <IoShuffleSharp />
        </button>
        <button
          className={`${styles.loop} ${loop && styles.loopTrack}`}
          onClick={toggleLoop}
        >
          <BiRepeat />
        </button>
        <div className={styles.trackContainer}>
          <div className={styles.currentTime}>{calculateTime(playingTime)}</div>
          <div className={styles.track}>
            <input
              ref={progressBar}
              type="range"
              className={styles.progressBar}
              onChange={changeRange}
              step="0.3"
              defaultValue="0"
              onClick={onPlayerClick}
              max={trackDuration}
            />
          </div>
          <div className={styles.duration}>
            {!isNaN(trackDuration) ? calculateTime(trackDuration) : "0:00"}
          </div>
        </div>
        {isMuted ? (
          <button className={styles.volume} onClick={toggleMuteUnmute}>
            <RiVolumeMuteFill />
          </button>
        ) : (
          <button className={styles.volume} onClick={toggleMuteUnmute}>
            <MdVolumeUp />
          </button>
        )}
        <div className={styles.trackInfo}>
          <img
            src="https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
            alt={`누구의 어떤 노래`}
          />
          <div className={styles.artistTrackName}>
            <div className={styles.artistName} onClick={clickArtist}>
              Artist
            </div>
            <div className={styles.trackName} onClick={clickTrack}>
              <span>Track Name</span>
            </div>
          </div>
          {likeTrack ? (
            <button
              className={`${styles.unlikeTrack} ${styles.listenEngagement}`}
              onClick={unlikeTrack}
            >
              <BsFillSuitHeartFill />
            </button>
          ) : (
            <button
              className={`${styles.likeTrack} ${styles.listenEngagement}`}
              onClick={onLikeTrack}
            >
              <BsFillSuitHeartFill />
            </button>
          )}
          {followArtist ? (
            <button
              className={`${styles.unfollowArtist} ${styles.listenEngagement}`}
              onClick={unfollowArtist}
            >
              <RiUserUnfollowFill />
            </button>
          ) : (
            <button
              className={`${styles.followAritst} ${styles.listenEngagement}`}
              onClick={onFollowArtist}
            >
              <RiUserFollowFill />
            </button>
          )}

          <button className={`${styles.nextUp} ${styles.listenEngagement}`}>
            <MdPlaylistPlay />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackBar;
