import React, { createContext, useContext, useRef, useState } from "react";

// 토큰 타입 지정
interface ITrackContext {
  trackDuration: number; // 현재 재생되고 있는 트랙 src
  setTrackDuration: React.Dispatch<React.SetStateAction<number>>;
  trackIsPlaying: boolean; // 현재 트랙이 재생되고 있는지
  setTrackIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playingTime: number; // 현재 재생되고 있는 시점(재생되고 있는 트랙 페이지일 경우 트랙페이지 플레이어와 하단 바 플레이어 싱크를 맞추기 위함)
  setPlayingTime: React.Dispatch<React.SetStateAction<number>>;
  audioPlayer: any; // 현재 재생되고 있는 오디오 -- 이거를 하단 바와 다른 곳에 있는 플레이어에 동시 적용하는 방식을 생각해보았습니다
  isMuted: boolean; // 음소거 여부
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

const TrackContext = createContext<ITrackContext>({
  trackDuration: 0,
  setTrackDuration: () => Number,
  trackIsPlaying: false,
  setTrackIsPlaying: () => Boolean,
  playingTime: 0,
  setPlayingTime: () => Number,
  audioPlayer: null,
  isMuted: false,
  setIsMuted: () => Boolean,
});

export const TrackProvider = ({ children }: { children: React.ReactNode }) => {
  const [trackDuration, setTrackDuration] =
    useState<ITrackContext["trackDuration"]>(0); // 나중에 유저가 가장 마지막에 들었던 노래를 받아올 수 있게 되면 그 정보를 setTrackSrc로 받아올 수 있을 것 같습니다
  const [trackIsPlaying, setTrackIsPlaying] =
    useState<ITrackContext["trackIsPlaying"]>(false);
  const [playingTime, setPlayingTime] =
    useState<ITrackContext["playingTime"]>(0);
  const audioPlayer = useRef<ITrackContext["audioPlayer"]>(new Audio());
  const [isMuted, setIsMuted] = useState(false);

  return (
    <TrackContext.Provider
      value={{
        trackDuration,
        setTrackDuration,
        trackIsPlaying,
        setTrackIsPlaying,
        playingTime,
        setPlayingTime,
        audioPlayer,
        isMuted,
        setIsMuted,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => useContext(TrackContext);
