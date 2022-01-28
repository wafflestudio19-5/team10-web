import React, { useRef } from "react";
import styles from "./SetImage.module.scss";
import ColorThief from "colorthief";
import { IPlaylist } from "../SetPage";

const SetImage = ({
  openModal,
  playlist,
  setHeader,
}: {
  openModal: () => void;
  playlist: IPlaylist;
  setHeader: React.Ref<HTMLDivElement>;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const onImageError: React.ReactEventHandler<HTMLImageElement> = ({
    currentTarget,
  }) => {
    currentTarget.onerror = null;
    currentTarget.src = "/default_track_image.svg";
  };
  return (
    <div className={styles.albumImage} onClick={openModal}>
      <img
        ref={imgRef}
        src={
          playlist?.image ||
          (playlist?.tracks !== null &&
            playlist.tracks.length !== 0 &&
            playlist.tracks[0].image) ||
          "/default_track_image.svg"
        }
        onError={onImageError}
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
