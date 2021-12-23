import React, { createContext, useContext, useState } from "react";

// 토큰 타입 지정
interface ITrackContext {
  trackSrc: string; // 현재 재생되고 있는 트랙 src
  setTrackSrc: React.Dispatch<React.SetStateAction<string>>;
  trackIsPlaying: boolean; // 현재 트랙이 재생되고 있는지
  setTrackIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playingTime: number; // 현재 재생되고 있는 시점(재생되고 있는 트랙 페이지일 경우 트랙페이지 플레이어와 하단 바 플레이어 싱크를 맞추기 위함)
  setPlayingTime: React.Dispatch<React.SetStateAction<number>>;
}

const TrackContext = createContext<ITrackContext>({
  trackSrc: "",
  setTrackSrc: () => "",
  trackIsPlaying: false,
  setTrackIsPlaying: () => Boolean,
  playingTime: 0,
  setPlayingTime: () => Number,
});

export const TrackProvider = ({ children }: { children: React.ReactNode }) => {
  const [trackSrc, setTrackSrc] = useState<ITrackContext["trackSrc"]>(""); // 나중에 유저가 가장 마지막에 들었던 노래를 받아올 수 있게 되면 그 정보를 setTrackSrc로 받아올 수 있을 것 같습니다
  const [trackIsPlaying, setTrackIsPlaying] =
    useState<ITrackContext["trackIsPlaying"]>(false);
  const [playingTime, setPlayingTime] =
    useState<ITrackContext["playingTime"]>(0);

  return (
    <TrackContext.Provider
      value={{
        trackSrc,
        setTrackSrc,
        trackIsPlaying,
        setTrackIsPlaying,
        playingTime,
        setPlayingTime,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => useContext(TrackContext);
