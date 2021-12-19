import React, { createContext, useContext, useState } from "react";

// 토큰 타입 지정
interface ITrackContext {
  trackSrc: string;
  setTrackSrc: React.Dispatch<React.SetStateAction<string>>;
  trackIsPlaying: boolean;
  setTrackIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playingTime: number;
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
  // token의 기본값은 undefined로 설정
  const [trackSrc, setTrackSrc] = useState<ITrackContext["trackSrc"]>("");
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
