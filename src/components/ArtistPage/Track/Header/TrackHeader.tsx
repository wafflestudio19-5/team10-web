import React, { useEffect, useRef, useState } from "react";
import styles from "./TrackHeader.module.scss";
import { IArtist, ITrack } from "../TrackPage";
import HeaderButton from "./HeaderButton";
import TrackInfo from "./TrackInfo";
import TrackTag from "./TrackTag";
import { useTrackContext } from "../../../../context/TrackContext";
import { MdOutlineCancel } from "react-icons/md";
import AlbumImage from "./AlbumImage";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import WaveSurfer from "wavesurfer.js";

const TrackHeader = ({
  openModal,
  track,
  artist,
  noTrack,
}: {
  openModal: () => void;
  track: ITrack;
  artist: IArtist;
  noTrack: boolean;
}) => {
  // const [isPlaying, setIsPlaying] = useState(false); // 트랙이 재생중인지
  const [headerTrackDuration, setHeaderTrackDuration] = useState<
    number | undefined
  >(undefined); // 트랙 길이
  const [trackLoading, setTrackLoading] = useState(true);
  const [isSameTrack, setIsSameTrack] = useState<boolean | undefined>(
    undefined
  );
  const trackHeader = useRef<HTMLDivElement>(null); // 헤더 전체 div(재생과는 무관)

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
  } = useTrackContext();
  const headerTrackSrc = track.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];
  useEffect(() => {
    if (barTrackSrc === headerTrackSrc) {
      setIsSameTrack(true);
    } else {
      setIsSameTrack(false);
    }
  }, [track]);

  useEffect(() => {
    if (barTrackSrc === headerTrackSrc) {
      setHeaderTrackDuration(trackDuration);
    }
  }, [track, isSameTrack, trackDuration]);

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

  const buttonDisabled = noTrack || trackLoading;
  const togglePlayPause = () => {
    if (buttonDisabled) {
      return;
    }
    // 재생/일시정지 버튼 누를 때
    if (barTrackSrc === headerTrackSrc) {
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
      setTrackIsPlaying(true);
      setTrackBarArtist(artist);
      setTrackBarTrack(track);
      setIsSameTrack(true);
      audioPlayer.current.src = track.audio;
      audioPlayer.current.load();
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
        animationRef.current = requestAnimationFrame(whilePlaying);
      }, 1);
    }
  };
  console.log(track.audio);

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
    } else if (progressBar.current) {
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

  const headerPlayer = useRef<HTMLAudioElement>(null);
  const onLoadedMetadata = () => {
    setHeaderTrackDuration(headerPlayer.current?.duration);
    setTrackLoading(false);
  };

  return (
    <div ref={trackHeader} className={styles.trackHeader}>
      <div className={styles.trackInfo}>
        <HeaderButton
          isPlaying={trackIsPlaying}
          togglePlayPause={togglePlayPause}
          isSameTrack={isSameTrack}
          buttonDisabled={buttonDisabled}
        />
        <TrackInfo track={track} artist={artist} />
      </div>
      {noTrack ? (
        <div className={styles.noTrackFound}>
          <MdOutlineCancel />
          This track was not found. Maybe it has been removed
        </div>
      ) : (
        <div className={styles.playingTrack}>
          <div className={styles.trackPlayer}>
            <div className={styles.time}>
              <div className={styles.currentTime}>
                {isSameTrack && calculateTime(playingTime)}
              </div>
              <div className={styles.duration}>
                {typeof headerTrackDuration === "number" &&
                  !isNaN(headerTrackDuration) &&
                  calculateTime(headerTrackDuration)}
              </div>
            </div>
            <div className={styles.barContainer}>
              <audio
                ref={headerPlayer}
                src={track.audio}
                preload="metadata"
                onLoadedMetadata={onLoadedMetadata}
              />
              <input
                ref={progressBar}
                type="range"
                className={styles.progressBar}
                defaultValue="0"
                onChange={audioSrc === track.audio ? changeRange : () => null}
                step="0.3"
                onClick={onPlayerClick}
                max={
                  audioSrc === track.audio && headerTrackDuration
                    ? trackDuration
                    : headerTrackDuration
                }
              />
            </div>
          </div>
        </div>
      )}

      {noTrack || <TrackTag track={track} />}
      {noTrack || (
        <AlbumImage
          openModal={openModal}
          track={track}
          trackHeader={trackHeader}
        />
      )}
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
