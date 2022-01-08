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
import { useAuthContext } from "../../../../context/AuthContext";
import axios from "axios";
import { IFollowings } from "../Main/ListenArtistInfo";
import { ILikeTrack } from "../Main/ListenEngagement";
// import throttle from "lodash/throttle";

// import axios from "axios";

const TrackBar = () => {
  const [likeTrack, setLikeTrack] = useState<boolean | undefined>(undefined);
  const [followArtist, setFollowArtist] = useState<boolean | undefined>(
    undefined
  );
  const [likeLoading, setLikeLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(true);

  const {
    trackDuration,
    trackIsPlaying,
    setTrackIsPlaying,
    playingTime,
    setPlayingTime,
    audioPlayer,
    audioSrc,
    isMuted,
    setIsMuted,
    loop,
    setLoop,
    trackBarArtist,
    trackBarTrack,
  } = useTrackContext();
  const { userSecret } = useAuthContext();

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
  //   const throttleChangeRange = () => throttle(changeRange, 300);

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

  const clickArtist = () => {
    if (
      window.location.href.split("soundwaffle.com")[1] ===
      `/${trackBarArtist.permalink}`
    ) {
      return;
    }
    history.push(`/${trackBarArtist.permalink}`);
  };
  const clickTrack = () => {
    if (
      window.location.href.split("soundwaffle.com")[1] ===
      `/${trackBarArtist.permalink}/${trackBarTrack.permalink}`
    ) {
      return;
    }
    history.push(`/${trackBarArtist.permalink}/${trackBarTrack.permalink}`);
  };

  const isLikeTrack = async () => {
    if (userSecret.id !== 0 && trackBarTrack.id !== 0) {
      const config: any = {
        method: "get",
        url: `/users/${userSecret.id}/likes/tracks`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        // like 트랙 목록 받아오기
        const likeTracks = await axios(config);
        if (likeTracks.data.results.length === 0) {
          setLikeLoading(false);
          setLikeTrack(false);
        } else {
          const trackExist = likeTracks.data.results.find(
            (likeTrack: ILikeTrack) => likeTrack.id === trackBarTrack.id
          );
          if (trackExist) {
            setLikeTrack(true);
          } else {
            setLikeTrack(false);
          }
          setLikeLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isFollowing = async () => {
    if (trackBarArtist.id !== 0 && userSecret.id !== 0) {
      const followConfig: any = {
        method: "get",
        url: `/users/${trackBarArtist.id}/followers`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        const { data } = await axios(followConfig);
        if (data.results.length === 0) {
          setFollowLoading(false);
          setFollowArtist(false);
        } else {
          const trackExist = data.results.find(
            (follower: IFollowings) => follower.id === userSecret.id
          );
          console.log(trackExist, "esatt");
          if (trackExist) {
            setFollowArtist(true);
          } else {
            setFollowArtist(false);
          }
          setFollowLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    isLikeTrack();
    isFollowing();
  }, [trackBarTrack]);

  const onLikeTrack = async () => {
    const config: any = {
      method: "post",
      url: `/likes/tracks/${trackBarTrack.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      if (response) {
        setLikeTrack(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const unlikeTrack = async () => {
    const config: any = {
      method: "delete",
      url: `/likes/tracks/${trackBarTrack.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      if (response) {
        setLikeTrack(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFollowArtist = async () => {
    const config: any = {
      method: "post",
      url: `/users/me/followings/${trackBarArtist.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      if (response) {
        setFollowArtist(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const unfollowArtist = async () => {
    const config: any = {
      method: "delete",
      url: `/users/me/followings/${trackBarArtist.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      if (response) {
        setFollowArtist(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log();

  //   const nextTrack = () => {
  //     setPlayingTime(0);
  //     setTrackIsPlaying(true);
  //     setAudioSrc(
  //       "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  //     );
  //     audioPlayer.current.src =
  //       "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

  //     audioPlayer.current.load();
  //     setTimeout(() => {
  //       audioPlayer.current.play();
  //       barAnimationRef.current = requestAnimationFrame(whilePlaying);
  //     }, 1);
  //   };

  //   const prevTrack = () => {
  //     setPlayingTime(0);
  //     setTrackIsPlaying(true);
  //     setAudioSrc(
  //       "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  //     );
  //     audioPlayer.current.src =
  //       "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  //     audioPlayer.current.load();
  //     setTimeout(() => {
  //       audioPlayer.current.play();
  //       barAnimationRef.current = requestAnimationFrame(whilePlaying);
  //     }, 1);
  //   };

  return (
    <>
      {!!audioSrc.length && (
        <div className={styles.container}>
          <div className={styles.main}>
            <button
              className={styles.previousTrack}
              // onClick={prevTrack}
            >
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
            <button
              className={styles.nextTrack}
              // onClick={nextTrack}
            >
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
              <img
                src={trackBarTrack.image || "/default.track_image.svg"}
                alt={`${trackBarArtist.display_name}의 ${trackBarTrack.title} 트랙 이미지`}
              />
              <div className={styles.artistTrackName}>
                <div className={styles.artistName} onClick={clickArtist}>
                  {trackBarArtist.display_name}
                </div>
                <div className={styles.trackName} onClick={clickTrack}>
                  <span>{trackBarTrack.title}</span>
                </div>
              </div>
              {trackBarArtist.id === userSecret.id || (
                <>
                  {likeTrack === true && (
                    <button
                      className={`${styles.unlikeTrack} ${styles.listenEngagement}`}
                      onClick={unlikeTrack}
                      disabled={likeLoading || likeTrack}
                    >
                      <BsFillSuitHeartFill />
                    </button>
                  )}
                  {likeTrack === false && (
                    <button
                      className={`${styles.likeTrack} ${styles.listenEngagement}`}
                      onClick={onLikeTrack}
                      disabled={likeLoading || !likeTrack}
                    >
                      <BsFillSuitHeartFill />
                    </button>
                  )}
                  {followArtist === true && (
                    <button
                      className={`${styles.unfollowArtist} ${styles.listenEngagement}`}
                      onClick={unfollowArtist}
                      disabled={followLoading || followArtist}
                    >
                      <RiUserUnfollowFill />
                    </button>
                  )}
                  {followArtist === false && (
                    <button
                      className={`${styles.followAritst} ${styles.listenEngagement}`}
                      onClick={onFollowArtist}
                      disabled={followLoading || !followArtist}
                    >
                      <RiUserFollowFill />
                    </button>
                  )}
                </>
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
