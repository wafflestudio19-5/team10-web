import { useTrackContext } from "../../../../context/TrackContext";
// import { useAuthContext } from "../../../../context/AuthContext";
// import axios from "axios";
// import { useEffect } from "react";

const AudioTag = () => {
  const {
    audioPlayer,
    audioSrc,
    setTrackDuration,
    setTrackIsPlaying,
    isMuted,
    loop,
    // playingTime,
    // trackDuration,
    // trackBarTrack,
    // trackIsPlaying,
  } = useTrackContext();
  //   const { userSecret } = useAuthContext();
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

  //   useEffect(() => {
  //     const patchCount = async () => {
  //       console.log(playingTime);
  //       if (playingTime === trackDuration / 3 && trackIsPlaying) {
  //         const config: any = {
  //           method: "patch",
  //           url: `/tracks/${trackBarTrack.id}`,
  //           headers: {
  //             Authorization: `JWT ${userSecret.jwt}`,
  //           },
  //           data: { count: trackBarTrack.count + 1 },
  //         };
  //         try {
  //           const response = await axios(config);
  //           console.log(response);
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       }
  //     };
  //     patchCount();
  //   }, [playingTime]);

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
