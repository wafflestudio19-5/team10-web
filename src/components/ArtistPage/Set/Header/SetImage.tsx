import React, { useRef } from "react";
import styles from "./SetImage.module.scss";
import ColorThief from "colorthief";
import { IPlaylist } from "../SetPage";
import { useTrackContext } from "../../../../context/TrackContext";

const SetImage = ({
  openModal,
  playlist,
  setHeader,
  playing,
}: {
  openModal: () => void;
  playlist: IPlaylist;
  setHeader: React.Ref<HTMLDivElement>;
  playing: string;
}) => {
  const imgRef = useRef(null);
  const { trackBarTrack } = useTrackContext();
  return (
    <div className={styles.albumImage} onClick={openModal}>
      <img
        ref={imgRef}
        src={
          playlist.tracks.length === 0
            ? "/default_track_image.svg"
            : playing === "before"
            ? playlist.image ||
              playlist.tracks[0].image ||
              "/default_track_image.svg"
            : trackBarTrack.image || "/default_track_image.svg"
        }
        alt={`${playlist.title}의 트랙 이미지`}
        crossOrigin="anonymous"
        onLoad={() => {
          const colorThief = new ColorThief();
          const colors = colorThief.getColor(imgRef.current);
          const { current }: any = setHeader;
          const [red, green, blue] = colors;
          if (current !== null) {
            current.style.setProperty("--red", `${red}`);
            current.style.setProperty("--green", `${green}`);
            current.style.setProperty("--blue", `${blue}`);
          }
        }}
      />
    </div>
  );
};

export default SetImage;
