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
    audioSrc,
    setAudioSrc,
    isMuted,
    setIsMuted,
    loop,
    setLoop,
    trackBarArtist,
    trackBarTrack,
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
    if (audioSrc.length === 0) return;
    // 재생/일시정지 버튼 누를 때
    const prevValue = trackIsPlaying;
    setTrackIsPlaying(!prevValue);
    const isPlaying =
      audioPlayer.current.currentTime > 0 &&
      !audioPlayer.current.paused &&
      !audioPlayer.current.ended &&
      audioPlayer.current.readyState > audioPlayer.current.HAVE_CURRENT_DATA;
    if (!prevValue && !isPlaying) {
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
    // progressBar.current.value = audioPlayer.current.currentTime;
    if (progressBar.current) {
      setPlayingTime(progressBar.current.value);
      changePlayerCurrentTime();
      barAnimationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  useEffect(() => {
    if (trackIsPlaying) {
      barAnimationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      cancelAnimationFrame(barAnimationRef.current);
    }
  }, [trackIsPlaying]);

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

  const nextTrack = () => {
    setPlayingTime(0);
    setTrackIsPlaying(true);
    setAudioSrc(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    );
    audioPlayer.current.src =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

    audioPlayer.current.load();
    setTimeout(() => {
      audioPlayer.current.play();
      barAnimationRef.current = requestAnimationFrame(whilePlaying);
    }, 1);
  };

  const prevTrack = () => {
    setPlayingTime(0);
    setTrackIsPlaying(true);
    setAudioSrc(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    );
    audioPlayer.current.src =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    audioPlayer.current.load();
    setTimeout(() => {
      audioPlayer.current.play();
      barAnimationRef.current = requestAnimationFrame(whilePlaying);
    }, 1);
  };

  return (
    <>
      {audioSrc.length && (
        <div className={styles.container}>
          <div className={styles.main}>
            <button className={styles.previousTrack} onClick={prevTrack}>
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
            <button className={styles.nextTrack} onClick={nextTrack}>
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
              <div className={styles.currentTime}>
                {calculateTime(playingTime)}
              </div>
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
              {trackBarTrack.image.length !== 0 && (
                <img
                  src={trackBarTrack.image}
                  alt={`${trackBarArtist.display_name}의 ${trackBarTrack.title} 트랙 이미지`}
                />
              )}
              <div className={styles.artistTrackName}>
                <div className={styles.artistName} onClick={clickArtist}>
                  {trackBarArtist.display_name}
                </div>
                <div className={styles.trackName} onClick={clickTrack}>
                  <span>{trackBarTrack.title}</span>
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
      )}
    </>
  );
};

export default TrackBar;
