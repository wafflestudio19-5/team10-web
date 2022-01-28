import React, { useCallback } from "react";
import styles from "./TrackBar.module.scss";
import {
  IoPlaySkipBackSharp,
  IoPlaySharp,
  IoPauseSharp,
  IoPlaySkipForwardSharp,
  IoShuffleSharp,
} from "react-icons/io5";
import { BiRepeat } from "react-icons/bi";
// import { BsFillSuitHeartFill } from "react-icons/bs";
import {
  //   RiUserFollowFill,
  //   RiUserUnfollowFill,
  RiVolumeMuteFill,
} from "react-icons/ri";
import { MdVolumeUp, MdPlaylistPlay } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTrackContext } from "../../../../context/TrackContext";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useAuthContext } from "../../../../context/AuthContext";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { shuffle, throttle } from "lodash";
import axios from "axios";
// import { useAuthContext } from "../../../../context/AuthContext";
// import axios from "axios";
// import { IFollowings } from "../Main/ListenArtistInfo";
// import { ILikeTrack } from "../Main/ListenEngagement";
// import throttle from "lodash/throttle";

// import axios from "axios";

export interface ITrackBarTrack {
  id: number;
  title: string;
  permalink: string;
  audio: string;
  image: string | null;
  //   like_count: number;
  //   repost_count: number;
  //   comment_count: number;
  //   genre: string | null;
  //   count: number;
  //   is_private: boolean;
}
export interface ITrackBarArtist {
  display_name: string;
  id: number;
  permalink: string;
}
export interface ITrackBarPlaylist {
  id: number;
  title: string;
  permalink: string;
  audio: string;
  image: string | null;
  artist: number;
  artist_display_name: string;
  artist_permalink: string;
}

const TrackBar = () => {
  //   const [likeTrack, setLikeTrack] = useState<boolean | undefined>(undefined);
  //   const [followArtist, setFollowArtist] = useState<boolean | undefined>(
  //     undefined
  //   );
  //   const [likeLoading, setLikeLoading] = useState(true);
  //   const [followLoading, setFollowLoading] = useState(true);
  const { userSecret } = useAuthContext();
  const [nextup, setNextup] = useState(false);
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
    setTrackBarTrack,
    setTrackBarPlaylist,
    setTrackBarArtist,
    setAudioSrc,
    trackBarPlaylist,
    setSeekTime,
  } = useTrackContext();
  //   const { userSecret } = useAuthContext();

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

  const changePlayerCurrentTime = useCallback(
    throttle(() => {
      if (progressBar.current && audioPlayer.current) {
        progressBar.current.value = audioPlayer.current.currentTime;
        // 재생 바에 슬라이더가 있는 곳까지 색을 바꾸기 위함
        progressBar.current.style.setProperty(
          "--seek-before-width",
          `${(audioPlayer.current.currentTime / trackDuration) * 100}%`
        );
        setPlayingTime(audioPlayer.current.currentTime);
      } else if (progressBar.current) {
        setPlayingTime(0);
        progressBar.current.value = 0;
        progressBar.current.style.setProperty("--seek-before-width", `0%`);
      }
    }, 30000),
    [playingTime]
  );

  useEffect(() => {
    changePlayerCurrentTime();
  }, [playingTime]);

  const onPlayerClick = () => {
    audioPlayer.current.pause();
    // 재생 바 아무곳이나 누르면 일시정지 상태였더라도 재생되도록 함
    setPlayingTime(progressBar.current.value);
    setSeekTime(progressBar.current.value);
    setTrackIsPlaying(true);
    setTimeout(() => {
      audioPlayer.current.play();
    }, 10);
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

  const nextTrack = async () => {
    if (trackBarPlaylist.length === 0) {
      return toast.error(
        "해당 기능은 플레이리스트를 재생했을 때 사용할 수 있습니다"
      );
    }
    const current = trackBarPlaylist.findIndex(
      (track) => track.id === trackBarTrack.id
    );
    if (current === trackBarPlaylist.length - 1) {
      return toast.error("다음 트랙이 없습니다");
    }
    audioPlayer.current.pause();
    setPlayingTime(0);
    setTrackIsPlaying(true);
    setTrackBarTrack(trackBarPlaylist[current + 1]);
    setTrackBarArtist({
      display_name: trackBarPlaylist[current + 1].artist_display_name,
      id: trackBarPlaylist[current + 1].artist,
      permalink: trackBarPlaylist[current + 1].artist_permalink,
    });
    audioPlayer.current.src = trackBarPlaylist[current + 1].audio;
    setAudioSrc(trackBarPlaylist[current + 1].audio);
    audioPlayer.current.load();
    audioPlayer.current.pause();
    setTimeout(() => {
      audioPlayer.current.play();
      barAnimationRef.current = requestAnimationFrame(whilePlaying);
    }, 1);
  };

  const prevTrack = async () => {
    if (trackBarPlaylist.length === 0) {
      return toast.error(
        "해당 기능은 플레이리스트를 재생했을 때 사용할 수 있습니다"
      );
    }
    const current = trackBarPlaylist.findIndex(
      (track) => track.id === trackBarTrack.id
    );
    if (current === 0) {
      return toast.error("이전 트랙이 없습니다");
    }
    audioPlayer.current.pause();
    setPlayingTime(0);
    setTrackIsPlaying(true);
    setTrackBarTrack(trackBarPlaylist[current - 1]);
    setTrackBarArtist({
      display_name: trackBarPlaylist[current - 1].artist_display_name,
      id: trackBarPlaylist[current - 1].artist,
      permalink: trackBarPlaylist[current - 1].artist_permalink,
    });
    audioPlayer.current.src = trackBarPlaylist[current - 1].audio;
    setAudioSrc(trackBarPlaylist[current - 1].audio);
    audioPlayer.current.load();
    audioPlayer.current.pause();
    setTimeout(() => {
      audioPlayer.current.play();
      barAnimationRef.current = requestAnimationFrame(whilePlaying);
    }, 1);
  };

  useEffect(() => {
    if (audioPlayer.current?.ended) {
      if (trackBarPlaylist.length === 0) return;
      if (
        audioPlayer.current.src ===
        trackBarPlaylist[trackBarPlaylist.length - 1].audio
      ) {
        setTrackBarTrack(trackBarPlaylist[0]);
        audioPlayer.current.src = trackBarPlaylist[0].audio;
        setPlayingTime(0);
        return;
      }
      nextTrack();
    }
  }, [playingTime]);

  const shuffleTracks = () => {
    if (trackBarPlaylist.length === 0) {
      return toast.error(
        "해당 기능은 플레이리스트를 재생했을 때 사용할 수 있습니다"
      );
    }
    const currentIndex = trackBarPlaylist.findIndex(
      (track) => track.id === trackBarTrack.id
    );
    if (currentIndex < trackBarPlaylist.length - 2) {
      const prevTracks = trackBarPlaylist.slice(0, currentIndex + 1);
      const nextTracks = trackBarPlaylist.slice(
        currentIndex + 1,
        trackBarPlaylist.length
      );
      const shuffled = shuffle(nextTracks);
      const newPlaylist = prevTracks.concat(shuffled);
      setTrackBarPlaylist(newPlaylist);
    }
  };

  const toggleNextup = () => setNextup(!nextup);

  useEffect(() => {
    const getLastTrack = async () => {
      if (userSecret.id != 0) {
        const config: any = {
          method: "get",
          url: `/users/${userSecret.id}/history/tracks`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          const { data } = await axios(config);
          if (data.count != 0) {
            const track = data.results[0];
            setTrackBarTrack({
              id: track.id,
              title: track.title,
              permalink: track.permalink,
              audio: track.audio,
              image: track.image,
            });
            setAudioSrc(track.audio);
            setTrackBarArtist({
              id: track.artist.id,
              permalink: track.artist.permalink,
              display_name: track.artist.display_name,
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("마지막으로 들었던 트랙 정보를 불러올 수 없습니다");
        }
      }
    };
    getLastTrack();
  }, [userSecret.id]);

  useEffect(() => {
    const putHit = async () => {
      if (trackIsPlaying && userSecret.jwt) {
        const config: any = {
          method: "put",
          url: `/tracks/${trackBarTrack.id}/hit`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        try {
          await axios(config);
        } catch (error) {
          console.log(error);
        }
      }
    };
    putHit();
  }, [audioPlayer.current?.src, userSecret.jwt]);

  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_track_image.svg";
  };

  return (
    <>
      {!!audioSrc.length && (
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
            <button className={styles.shuffle} onClick={shuffleTracks}>
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
                src={trackBarTrack.image || "/default_track_image.svg"}
                onError={onImageError}
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
              {/* {trackBarArtist.id === userSecret.id || (
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
              )} */}
              <button
                className={`${styles.nextUp} ${styles.listenEngagement}`}
                onClick={toggleNextup}
              >
                <MdPlaylistPlay />
              </button>
            </div>
          </div>
          {nextup ? (
            <div className={styles.nextList}>
              <div className={styles.header}>
                <div className={styles.panel}>Next up</div>
                <span onClick={() => setNextup(false)}>
                  <AiOutlineClose />
                </span>
              </div>

              <ul className={styles.trackList}>
                {trackBarPlaylist.map((track) => {
                  return (
                    <TrackBarList
                      key={track.id}
                      track={track}
                      //   clickArtist={clickArtist}
                      //   clickTrack={clickTrack}
                    />
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

const TrackBarList = ({
  track,
}: //   clickArtist,
//   clickTrack,
{
  track: ITrackBarPlaylist;
  //   clickArtist: () => void;
  //   clickTrack: () => void;
}) => {
  const [play, setPlay] = useState(false);
  const {
    audioSrc,
    setPlayingTime,
    audioPlayer,
    setAudioSrc,
    setTrackBarTrack,
    setTrackIsPlaying,
    trackIsPlaying,
    trackBarTrack,
    setTrackBarArtist,
  } = useTrackContext();
  const history = useHistory();
  const headerTrackSrc = track.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];
  const togglePlayButton = () => {
    if (!play) {
      if (headerTrackSrc !== barTrackSrc) {
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
    } else {
      audioPlayer.current.pause();
      setPlay(false);
      setTrackIsPlaying(false);
    }
  };
  useEffect(() => {
    if (headerTrackSrc === barTrackSrc && trackIsPlaying) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  }, [audioSrc, trackIsPlaying]);
  const clickArtist = () => history.push(`/${track.permalink}`);
  const clickTrack = () =>
    history.push(`/${track.artist_permalink}/${track.permalink}`);

  return (
    <li
      key={track.id}
      className={track.id === trackBarTrack.id ? styles.playing : undefined}
    >
      <div className={styles.image}>
        <img src={track.image || "/default_track_image.svg"} />
        <div className={styles.playButton} onClick={() => togglePlayButton()}>
          {play ? <IoMdPause /> : <IoMdPlay />}
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.artistName} onClick={clickArtist}>
          {track.artist_display_name} -
        </span>
        &nbsp;
        <span className={styles.trackTitle} onClick={clickTrack}>
          {track.title}
        </span>
      </div>
    </li>
  );
};

export default TrackBar;
