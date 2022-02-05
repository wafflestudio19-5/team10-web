import React, { createContext, useContext, useRef, useState } from "react";
import {
  ITrackBarArtist,
  ITrackBarPlaylist,
  ITrackBarTrack,
} from "../components/ArtistPage/Track/TrackBar/TrackBar";
// import { IArtist } from "../components/ArtistPage/Track/TrackPage";

interface ITrackContext {
  trackDuration: number; // 현재 재생되고 있는 트랙 길이
  setTrackDuration: React.Dispatch<React.SetStateAction<number>>;
  trackIsPlaying: boolean; // 현재 트랙이 재생되고 있는지 아닌지(재생/일시정지 여부)
  setTrackIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playingTime: number; // 현재 재생되고 있는 시점(재생되고 있는 트랙 페이지일 경우 트랙페이지 플레이어와 하단 바 플레이어 싱크를 맞추기 위함)
  setPlayingTime: React.Dispatch<React.SetStateAction<number>>;
  audioPlayer: any; // 현재 재생되고 있는 오디오 -- 이거를 하단 바와 다른 곳에 있는 플레이어에 동시 적용하는 방식입니다(실제 재생되는 오디오는 하나(ArtistPage > Track > Audio > AudioTag.tsx에서))
  audioSrc: string; // 현재 오디오 src(결과적으로는 audioPlayer.current.src와 같습니다)
  setAudioSrc: React.Dispatch<React.SetStateAction<string>>;
  isMuted: boolean; // 음소거 여부
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  loop: boolean; // 반복재생 여부
  setLoop: React.Dispatch<React.SetStateAction<boolean>>;
  trackBarArtist: ITrackBarArtist; // 재생 트랙 아티스트 정보
  setTrackBarArtist: React.Dispatch<React.SetStateAction<ITrackBarArtist>>;
  trackBarTrack: ITrackBarTrack; // 재생 트랙 정보
  setTrackBarTrack: React.Dispatch<React.SetStateAction<ITrackBarTrack>>;
  trackBarPlaylist: ITrackBarPlaylist[]; // 재생 플레이리스트 담는 곳
  setTrackBarPlaylist: React.Dispatch<
    React.SetStateAction<ITrackBarPlaylist[]>
  >;
  seekTime: number;
  setSeekTime: React.Dispatch<React.SetStateAction<number>>;
  trackBarPlaylistId: number | undefined;
  setTrackBarPlaylistId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
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
  seekTime: 0,
  setSeekTime: () => Number,
  trackBarPlaylistId: undefined,
  setTrackBarPlaylistId: () => Number,
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
    image: "",
  });
  const [trackBarPlaylist, setTrackBarPlaylist] = useState<ITrackBarPlaylist[]>(
    []
  );
  const [seekTime, setSeekTime] = useState<ITrackContext["seekTime"]>(0);
  const [trackBarPlaylistId, setTrackBarPlaylistId] =
    useState<ITrackContext["trackBarPlaylistId"]>();

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
        seekTime,
        setSeekTime,
        trackBarPlaylistId,
        setTrackBarPlaylistId,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => useContext(TrackContext);
