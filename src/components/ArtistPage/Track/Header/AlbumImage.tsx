import React, { useRef } from "react";
import { ITrack } from "../TrackPage";
import styles from "./AlbumImage.module.scss";
import ColorThief from "colorthief";

const AlbumImage = ({
  openModal,
  track,
  trackHeader,
}: {
  openModal: () => void;
  track: ITrack;
  trackHeader: React.Ref<HTMLDivElement>;
}) => {
  const imgRef = useRef(null);
  return (
    <div className={styles.albumImage} onClick={openModal}>
      <img
        ref={imgRef}
        src={track.image || "/default_track_image.svg"}
        alt={`${track.title}의 트랙 이미지`}
        crossOrigin="anonymous"
        onLoad={() => {
          const colorThief = new ColorThief();
          const colors = colorThief.getColor(imgRef.current);
          const { current }: any = trackHeader;
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

export default AlbumImage;
