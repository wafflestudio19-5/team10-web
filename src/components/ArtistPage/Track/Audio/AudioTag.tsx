import { useTrackContext } from "../../../../context/TrackContext";

const AudioTag = () => {
  const {
    audioPlayer,
    audioSrc,
    setTrackDuration,
    setTrackIsPlaying,
    isMuted,
    loop,
  } = useTrackContext();
  const onLoadedMetadata = () => {
    // 트랙 metadata가 로드되었을 때 실행
    setTrackDuration(audioPlayer.current.duration);
  };
  const onEnded = () => {
    if (!loop) {
      // 트랙 재생이 끝났을 때(loop 설정이 안되어있을때)
      setTrackIsPlaying(false);
      audioPlayer.current.pause();
    }
  };

  return (
    <audio
      ref={audioPlayer}
      src={audioSrc}
      preload="metadata"
      onLoadedMetadata={onLoadedMetadata}
      muted={isMuted}
      loop={loop}
      onEnded={onEnded}
    />
  );
};

export default AudioTag;
