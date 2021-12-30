import React, { useEffect, useRef, useState } from "react";
import styles from "./TrackHeader.module.scss";
import { ITrack } from "../TrackPage";
import { useColor } from "color-thief-react";
import HeaderButton from "./PlayPauseButton";
import TrackInfo from "./TrackInfo";
import AlbumImage from "./AlbumImage";
import TrackTag from "./TrackTag";
import { useTrackContext } from "../../../../context/TrackContext";
// import WaveSurfer from "wavesurfer.js";

const TrackHeader = ({
  openModal,
  track,
}: {
  openModal: () => void;
  track: ITrack;
}) => {
  //   const [isPlaying, setIsPlaying] = useState(false); // 트랙이 재생중인지
  const [headerTrackDuration, setHeaderTrackDuration] = useState<
    number | undefined
  >(undefined); // 트랙 길이
  const trackHeader = useRef<HTMLDivElement>(null); // 헤더 전체 div(재생과는 무관)
  const { data } = useColor(track.image, "rgbArray", {
    // 트랙 이미지에 따라 헤더 색을 자동으로 생성
    crossOrigin: "anonymous",
    quality: 10,
  });
  useEffect(() => {
    const { current } = trackHeader;
    if (current !== null && data !== undefined) {
      const [red, green, blue] = data;
      current.style.setProperty("--red", `${red}`);
      current.style.setProperty("--green", `${green}`);
      current.style.setProperty("--blue", `${blue}`);
    }
  }, [trackHeader, data]);

  const {
    trackDuration,
    trackIsPlaying,
    setTrackIsPlaying,
    playingTime,
    setPlayingTime,
    audioPlayer,
    audioSrc,
    setAudioSrc,
  } = useTrackContext();
  const isSameTrack = audioSrc === track.audio;

  useEffect(() => {
    if (isSameTrack) {
      setHeaderTrackDuration(trackDuration);
    }
  }, [isSameTrack, trackDuration]);

  //   const audioPlayer = useRef<HTMLAudioElement>(new Audio()); // 오디오 태그 접근
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

  const togglePlayPause = () => {
    // 재생/일시정지 버튼 누를 때
    if (audioSrc === track.audio) {
      const prevValue = trackIsPlaying;
      setTrackIsPlaying(!prevValue);
      if (!prevValue) {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
        animationRef.current = requestAnimationFrame(whilePlaying);
      } else {
        audioPlayer.current.pause();
        setPlayingTime(audioPlayer.current.currentTime);
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setAudioSrc(track.audio);
      audioPlayer.current.src = track.audio;
      audioPlayer.current.load();
      setTimeout(() => {
        audioPlayer.current.play();
      }, 1);
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

  const changePlayerCurrentTime = () => {
    if (progressBar.current && audioPlayer.current && isSameTrack) {
      progressBar.current.value = audioPlayer.current.currentTime;
      // 재생 바에 슬라이더가 있는 곳까지 색을 바꾸기 위함
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(audioPlayer.current.currentTime / trackDuration) * 100}%`
      );
      setPlayingTime(audioPlayer.current.currentTime);
    } else {
      setPlayingTime(0);
      progressBar.current.value = 0;
      progressBar.current.style.setProperty("--seek-before-width", `0%`);
    }
  };

  useEffect(() => {
    changePlayerCurrentTime();
  }, [playingTime]);

  const onPlayerClick = () => {
    // 재생 바 아무곳이나 누르면 일시정지 상태였더라도 재생되도록 함
    if (!isSameTrack) {
      setAudioSrc(track.audio);
      audioPlayer.current.src = track.audio;
      audioPlayer.current.load();
    }
    setTrackIsPlaying(true);
    setPlayingTime(progressBar.current.value);
    setTimeout(() => {
      audioPlayer.current.play();
    }, 1);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  return (
    <div ref={trackHeader} className={styles.trackHeader}>
      <div className={styles.trackInfo}>
        <HeaderButton
          isPlaying={trackIsPlaying}
          togglePlayPause={togglePlayPause}
          isSameTrack={isSameTrack}
        />
        <TrackInfo track={track} />
      </div>
      <div className={styles.playingTrack}>
        <div className={styles.trackPlayer}>
          <div className={styles.time}>
            <div className={styles.currentTime}>
              {audioSrc === track.audio && calculateTime(playingTime)}
            </div>
            <div className={styles.duration}>
              {typeof headerTrackDuration === "number" &&
                !isNaN(headerTrackDuration) &&
                calculateTime(headerTrackDuration)}
            </div>
          </div>
          <div className={styles.barContainer}>
            <input
              ref={progressBar}
              type="range"
              className={styles.progressBar}
              defaultValue="0"
              onChange={audioSrc === track.audio ? changeRange : () => null}
              step="0.3"
              onClick={onPlayerClick}
              max={
                audioSrc === track.audio
                  ? trackDuration
                  : headerTrackDuration && headerTrackDuration
              }
            />
          </div>
        </div>
      </div>
      <TrackTag track={track} />
      <AlbumImage openModal={openModal} track={track} />
    </div>
  );

  //   let [isPlaying, setIsPlaying] = useState(false);
  //   let [waveSurfer, setWaveSurfer] = useState<any>(null);

  //   const wavesurfer = useRef<any>(null);

  //   useEffect(() => {
  //     wavesurfer.current = WaveSurfer.create({
  //       container: "#waveform",
  //     });
  //     return () => wavesurfer.current.destroy();
  //   }, []);

  //   useEffect(() => {
  //     if (wavesurfer) {
  //       wavesurfer.current.load(track.audio);
  //     }
  //   }, [wavesurfer]);

  //   wavesurfer.current.on("ready", function () {
  //     wavesurfer.current.setVolume(0.5);
  //     wavesurfer.current.play();
  //   });

  //   openModal;
  //   return (
  //     <>
  //       <div ref={wavesurfer}></div>
  //     </>
  //   );
};

export default TrackHeader;