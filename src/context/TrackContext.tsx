import React, { createContext, useContext, useRef, useState } from "react";
import {
  ITrackBarArtist,
  ITrackBarTrack,
} from "../components/ArtistPage/Track/TrackBar/TrackBar";
// import { IArtist } from "../components/ArtistPage/Track/TrackPage";

interface ITrackContext {
  trackDuration: number; // 현재 재생되고 있는 트랙 길이
  setTrackDuration: React.Dispatch<React.SetStateAction<number>>;
  trackIsPlaying: boolean; // 현재 트랙이 재생되고 있는지
  setTrackIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playingTime: number; // 현재 재생되고 있는 시점(재생되고 있는 트랙 페이지일 경우 트랙페이지 플레이어와 하단 바 플레이어 싱크를 맞추기 위함)
  setPlayingTime: React.Dispatch<React.SetStateAction<number>>;
  audioPlayer: any; // 현재 재생되고 있는 오디오 -- 이거를 하단 바와 다른 곳에 있는 플레이어에 동시 적용하는 방식을 생각해보았습니다
  audioSrc: string; // 오디오 src
  setAudioSrc: React.Dispatch<React.SetStateAction<string>>;
  isMuted: boolean; // 음소거 여부
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  loop: boolean;
  setLoop: React.Dispatch<React.SetStateAction<boolean>>;
  trackBarArtist: ITrackBarArtist;
  setTrackBarArtist: React.Dispatch<React.SetStateAction<ITrackBarArtist>>;
  trackBarTrack: ITrackBarTrack;
  setTrackBarTrack: React.Dispatch<React.SetStateAction<ITrackBarTrack>>;
  trackBarPlaylist: ITrackBarTrack[];
  setTrackBarPlaylist: React.Dispatch<React.SetStateAction<ITrackBarTrack[]>>;
}

const TrackContext = createContext<ITrackContext>({
  trackDuration: 0,
  setTrackDuration: () => Number,
  trackIsPlaying: false,
  setTrackIsPlaying: () => Boolean,
  playingTime: 0,
  setPlayingTime: () => Number,
  audioPlayer: null,
  audioSrc: "",
  setAudioSrc: () => String,
  isMuted: false,
  setIsMuted: () => Boolean,
  loop: false,
  setLoop: () => Boolean,
  trackBarArtist: {
    display_name: "",
    // country: "",
    // city: "",
    id: 0,
    permalink: "",
  },
  setTrackBarArtist: () => {},
  trackBarTrack: {
    id: 0,
    title: "",
    permalink: "",
    audio: "",
    image: "",
    // like_count: 0,
    // repost_count: 0,
    // comment_count: 0,
    // genre: "",
    // count: 0,
    // is_private: false,
  },
  setTrackBarTrack: () => {},
  trackBarPlaylist: [],
  setTrackBarPlaylist: () => [],
});

export const TrackProvider = ({ children }: { children: React.ReactNode }) => {
  const [trackDuration, setTrackDuration] =
    useState<ITrackContext["trackDuration"]>(0); // 나중에 유저가 가장 마지막에 들었던 노래를 받아올 수 있게 되면 그 정보를 setTrackSrc로 받아올 수 있을 것 같습니다
  const [trackIsPlaying, setTrackIsPlaying] =
    useState<ITrackContext["trackIsPlaying"]>(false);
  const [playingTime, setPlayingTime] =
    useState<ITrackContext["playingTime"]>(0);
  const audioPlayer = useRef(new Audio());
  const [audioSrc, setAudioSrc] = useState<ITrackContext["audioSrc"]>("");
  const [isMuted, setIsMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [trackBarArtist, setTrackBarArtist] = useState<ITrackBarArtist>({
    display_name: "",
    id: 0,
    permalink: "",
  });
  const [trackBarTrack, setTrackBarTrack] = useState<ITrackBarTrack>({
    id: 0,
    title: "",
    permalink: "",
    audio: "",
    // comment_count: 0,
    // count: 0,
    // genre: null,
    image: "",
    // like_count: 0,
    // repost_count: 0,
    // is_private: false,
  });
  const [trackBarPlaylist, setTrackBarPlaylist] = useState<ITrackBarTrack[]>(
    []
  );

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
        audioSrc,
        setAudioSrc,
        isMuted,
        setIsMuted,
        loop,
        setLoop,
        trackBarArtist,
        setTrackBarArtist,
        trackBarTrack,
        setTrackBarTrack,
        trackBarPlaylist,
        setTrackBarPlaylist,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => useContext(TrackContext);
