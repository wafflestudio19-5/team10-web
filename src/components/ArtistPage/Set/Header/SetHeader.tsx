import { throttle } from "lodash";
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  //   useState,
} from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useTrackContext } from "../../../../context/TrackContext";
import { IPlaylist } from "../SetPage";
import SetButton from "./SetButton";
import styles from "./SetHeader.module.scss";
import SetImage from "./SetImage";
import SetInfo from "./SetInfo";
import SetTag from "./SetTag";

const SetHeader = ({
  openModal,
  playlist,
  noSet,
  playing,
  setPlaying,
}: {
  openModal: () => void;
  playlist: IPlaylist;
  noSet: boolean;
  playing: string;
  setPlaying: React.Dispatch<SetStateAction<string>>;
}) => {
  //   const [playing, setPlaying] = useState("before");
  //   const [headerTrackDuration, setHeaderTrackDuration] = useState<
  //     number | undefined
  //   >(undefined); // 트랙 길이
  //   const [trackLoading, setTrackLoading] = useState(true);
  const setHeader = useRef<HTMLDivElement>(null);
  const {
    trackDuration,
    trackIsPlaying,
    setTrackIsPlaying,
    playingTime,
    setPlayingTime,
    audioPlayer,
    audioSrc,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    // trackBarTrack,
    setTrackBarPlaylist,
  } = useTrackContext();
  const progressBar = useRef<any>(null); // 재생 바 태그 접근(input)
  const animationRef = useRef(0); // 재생 애니메이션
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
  //   const buttonDisabled = noSet || setLoading;
  const buttonDisabled = false;
  const togglePlayPause = () => {
    if (playing === "before") {
      setPlaying("playing");
      setAudioSrc(playlist.tracks[0].audio);
      setTrackIsPlaying(true);
      setTrackBarArtist({
        display_name: playlist.creator.display_name,
        id: playlist.creator.id,
        permalink: playlist.creator.permalink,
      });
      setTrackBarTrack({
        id: playlist.tracks[0].id,
        title: playlist.tracks[0].title,
        permalink: playlist.tracks[0].permalink,
        audio: playlist.tracks[0].audio,
        image: playlist.tracks[0].image,
        // like_count: track.like_count,
        // repost_count: track.repost_count,
        // comment_count: track.comment_count,
        // genre: track.genre,
        // count: track.count,
        // is_private: track.is_private,
      });
      setTrackBarPlaylist(playlist.tracks);
      audioPlayer.current.src = playlist.tracks[0].audio;
      setTimeout(() => {
        audioPlayer.current.play();
      }, 1);
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else if (playing === "playing") {
      setPlaying("paused");
      audioPlayer.current.pause();
      setTrackIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    } else {
      setPlaying("playing");
      audioPlayer.current.play();
      setTrackIsPlaying(true);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };
  const whilePlaying = () => {
    // progressBar.current.value = audioPlayer.current.currentTime;
    if (progressBar.current) {
      setPlayingTime(progressBar.current.value);
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

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
  }, [playingTime, audioSrc]);
  useEffect(() => {
    if (trackIsPlaying) {
      setPlaying("playing");
    } else if (playing !== "before" && trackIsPlaying === false) {
      setPlaying("paused");
    }
  }, [trackIsPlaying]);

  const onPlayerClick = () => {
    audioPlayer.current.pause();
    // 재생 바 아무곳이나 누르면 일시정지 상태였더라도 재생되도록 함
    audioPlayer.current.currentTime = progressBar.current.value;
    setPlayingTime(progressBar.current.value);
    // console.log(progressBar.current.value);
    setTrackIsPlaying(true);
    // audioPlayer.current.play();
    setTimeout(() => {
      audioPlayer.current.play();
    }, 10);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  //   const headerPlayer = useRef<HTMLAudioElement>(null);
  //   const onLoadedMetadata = useCallback(() => {
  //     setHeaderTrackDuration(headerPlayer.current?.duration);
  //     setTrackLoading(false);
  //   }, [audioSrc]);

  return (
    <div>
      <div ref={setHeader} className={styles.setHeader}>
        <div className={styles.setInfo}>
          <SetButton
            togglePlayPause={togglePlayPause}
            playing={playing}
            buttonDisabled={buttonDisabled}
          />
          <SetInfo playlist={playlist} />
        </div>
        {noSet === true && (
          <div className={styles.noSetFound}>
            <MdOutlineCancel />
            This playlist is not available anymore. It’s either been deleted or
            made private by the creator.
          </div>
        )}
        <div className={styles.playingTrack}>
          {playing === "before" ? (
            <div className={styles.trackCount}>
              <div className={styles.countNumber}>{playlist.tracks.length}</div>
              <div className={styles.tracks}>
                {playlist.tracks.length === 1 ? "TRACK" : "TRACKS"}
              </div>
            </div>
          ) : (
            <div className={styles.trackPlayer}>
              <div className={styles.time}>
                <div className={styles.currentTime}>
                  {calculateTime(playingTime)}
                </div>
                <div className={styles.duration}>
                  {typeof trackDuration === "number" &&
                    !isNaN(trackDuration) &&
                    calculateTime(trackDuration)}
                </div>
              </div>
              <div className={styles.barContainer}>
                {/* <audio
                ref={headerPlayer}
                src={trackBarTrack.audio}
                preload="metadata"
                onLoadedMetadata={onLoadedMetadata}
              /> */}
                <input
                  ref={progressBar}
                  type="range"
                  className={styles.progressBar}
                  defaultValue="0"
                  onChange={changeRange}
                  // onMouseDown={onPlayerClick}
                  onInput={onPlayerClick}
                  step="0.3"
                  // onMouseDown={(event) => {
                  //   event.preventDefault();
                  // }}
                  max={trackDuration}
                />
              </div>
            </div>
          )}
        </div>
        {noSet || <SetTag playlist={playlist} />}
        {noSet || (
          <SetImage
            openModal={openModal}
            playlist={playlist}
            setHeader={setHeader}
          />
        )}
      </div>
    </div>
  );
};
export default SetHeader;
