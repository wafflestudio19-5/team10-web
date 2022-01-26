import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./TrackHeader.module.scss";
import { IArtist, ITrack } from "../TrackPage";
import HeaderButton from "./HeaderButton";
import TrackInfo from "./TrackInfo";
import TrackTag from "./TrackTag";
import { useTrackContext } from "../../../../context/TrackContext";
import { MdOutlineCancel } from "react-icons/md";
import AlbumImage from "./AlbumImage";
import throttle from "lodash/throttle";
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
  >(undefined); // 트랙 길이 (필요없음)
  const [trackLoading, setTrackLoading] = useState(true); // 필요없음
  const [isSameTrack, setIsSameTrack] = useState<boolean | undefined>(
    undefined
  ); // 필요없음, 대신 Discover/ArtistPage 등등에서 사용하신 로직과 비슷한 걸 사용하시면 될 듯 합니다!(해당 트랙이 재생중인 트랙과 같은건지 아닌지)
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
    setTrackBarPlaylist,
    trackBarPlaylist,
  } = useTrackContext();
  // presigned url이 같은 트랙이더라도 뒷부분이 달라져서 앞부분만 비교하기 위함
  const headerTrackSrc = track.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];
  useEffect(() => {
    // 필요없음
    if (barTrackSrc === headerTrackSrc) {
      setIsSameTrack(true);
    } else {
      setIsSameTrack(false);
    }
  }, [track]);

  useEffect(() => {
    // 필요없음
    if (barTrackSrc === headerTrackSrc) {
      setHeaderTrackDuration(trackDuration);
    }
  }, [track, isSameTrack, trackDuration]);

  //   const audioPlayer = useRef<HTMLAudioElement>(new Audio()); // 오디오 태그 접근
  const progressBar = useRef<any>(null); // 재생 바 태그 접근(input) // 필요없음
  const animationRef = useRef(0); // 재생 애니메이션  // 필요없음

  const calculateTime = (secs: number) => {
    // 아마 필요없음
    // 트랙 길이를 분:초 단위로 환산
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const changeRange = () => {
    // 필요없음
    audioPlayer.current.currentTime = progressBar.current.value; // input slider와 트랙 연결
    setPlayingTime(audioPlayer.current.currentTime);
    changePlayerCurrentTime();
  };
  //   const throttleChangeRange = () => throttle(changeRange, 300);

  const buttonDisabled = noTrack || trackLoading;
  const togglePlayPause = () => {
    // 트랙페이지 재생/일시정지 버튼 누를 때
    if (barTrackSrc === headerTrackSrc) {
      // 트랙바에서 재생중인 트랙과 페이지에서 재생중인 트랙이 같을 때(재생/일시정지 바꿈)
      const prevValue = trackIsPlaying;
      setTrackIsPlaying(!prevValue); // 재생/일시정지 바꾸기
      if (!prevValue) {
        // 재생을 눌렀을 때
        audioPlayer.current.play(); // 콘텍스트에 담아놓은 오디오 파일 재생(Track > Audio > AudioTag.tsx)
        setPlayingTime(audioPlayer.current.currentTime); // 오디오 파일의 현재 시간을 콘텍스트에 담음
        animationRef.current = requestAnimationFrame(whilePlaying); // 필요없음
      } else {
        // 일시정지 눌렀을 때
        audioPlayer.current.pause();
        setPlayingTime(audioPlayer.current.currentTime);
        cancelAnimationFrame(animationRef.current); // 필요없음
      }
    } else {
      // 트랙바에서 재생중인 트랙과 페이지에서 재생중인 트랙이 다를 때
      if (
        trackBarPlaylist.find(
          (trackBarTrack) => trackBarTrack.id === track.id
        ) === undefined
      ) {
        setTrackBarPlaylist([]);
      }
      setAudioSrc(track.audio); // 콘텍스트에 오디오 src 담음
      setTrackIsPlaying(true); // 재생
      setTrackBarArtist({
        // 아티스트 정보
        display_name: artist.display_name,
        id: artist.id,
        permalink: artist.permalink,
      });
      setTrackBarTrack({
        // 트랙 정보
        id: track.id,
        title: track.title,
        permalink: track.permalink,
        audio: track.audio,
        image: track.image,
      });
      setIsSameTrack(true); // 필요없음
      audioPlayer.current.src = track.audio; // 오디오 플레이어(실제 재생되는 audio 태그)에 오디오 파일 담음
      setTimeout(() => {
        // 바로 play()하면 충돌?같은게 일어나는거 같아요
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime); // 현재 재생 시간 담음
      }, 1);
      //   changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying); // 필요없음
    }
  };

  const whilePlaying = () => {
    // 재생 중 트랙 바와 페이지 트랙과 싱크 맞추기 위함
    // progressBar.current.value = audioPlayer.current.currentTime;
    if (progressBar.current) {
      setPlayingTime(progressBar.current.value); // progressBar 대신 사용하는 플레이어 시간 넣기
      changePlayerCurrentTime(); // 필요없음
      animationRef.current = requestAnimationFrame(whilePlaying); // 필요없음
    }
  };

  const changePlayerCurrentTime = useCallback(
    // 필요없음
    throttle(() => {
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
    }, 30000),
    [playingTime]
  );
  useEffect(() => {
    // 제생각엔 라이브러리를 사용하면 changePlayerCurrentTime대신 whilePlaying()을 사용해야될거 같은데 실제로 안해봐서 잘 모르겠습니다..
    changePlayerCurrentTime();
  }, [playingTime, audioSrc]);

  const onPlayerClick = () => {
    // 이것도 라이브러리를 사용하면 어떻게 되는건지 잘 모르겠네요ㅠ 재생바 아무 위치나 클릭하면 재생이 되고, 또 그 시간/트랙 정보 등등이 콘텍스트에 담기도록 하기 위함입니다
    audioPlayer.current.pause();
    // 재생 바 아무곳이나 누르면 일시정지 상태였더라도 재생되도록 함
    if (!isSameTrack) {
      // 이미 재생하고 있던 트랙이 아닌 경우
      setAudioSrc(track.audio);
      setIsSameTrack(true); // 필요없음
      audioPlayer.current.src = track.audio;
      audioPlayer.current.load();
      //   audioPlayer.current.play();
      setTrackBarArtist({
        // 아티스트 정보
        display_name: artist.display_name,
        id: artist.id,
        permalink: artist.permalink,
      });
      setTrackBarTrack({
        // 트랙 정보
        id: track.id,
        title: track.title,
        permalink: track.permalink,
        audio: track.audio,
        image: track.image,
      });
    }
    // console.log("onclick");
    audioPlayer.current.currentTime = progressBar.current.value; // 클릭한 시간을 오디오 플레이어(실제 재생되는 audio 태그) 시간으로
    setPlayingTime(progressBar.current.value); // 콘텍스트에도 담아줌
    // console.log(progressBar.current.value);
    setTrackIsPlaying(true); // 사클에서는 트랙 재생바 클릭하면 무조건 재생되더라고용
    // audioPlayer.current.play();
    setTimeout(() => {
      audioPlayer.current.play();
    }, 10);
    animationRef.current = requestAnimationFrame(whilePlaying); // 필요없음
  };

  const headerPlayer = useRef<HTMLAudioElement>(null); // 필요없음
  const onLoadedMetadata = useCallback(() => {
    // 필요없음
    setHeaderTrackDuration(headerPlayer.current?.duration);
    setTrackLoading(false);
  }, [audioSrc]);

  return (
    <div ref={trackHeader} className={styles.trackHeader}>
      <div className={styles.trackInfo}>
        <HeaderButton
          togglePlayPause={togglePlayPause}
          isSameTrack={isSameTrack}
          buttonDisabled={buttonDisabled}
        />
        <TrackInfo track={track} artist={artist} />
      </div>
      {noTrack === true ? (
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
                // onMouseDown={onPlayerClick}
                onInput={onPlayerClick}
                step="0.3"
                // onMouseDown={(event) => {
                //   event.preventDefault();
                // }}
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
