import React from "react";
import AudioInfo from "./AudioInfo";
import CommentsInput from "./CommentsInput";
import ListenArtistInfo from "./ListenArtistInfo";
import ListenEngagement from "./ListenEngagement";
import Comments from "./Comments";
import styles from "./TrackMain.module.scss";
import RelatedTracks from "./Side/RelatedTracks";
import RepostUsers from "./Side/RepostUsers";
import LikeUsers from "./Side/LikeUsers";
import InPlaylists from "./Side/InPlaylists";

const TrackMain = () => {
  return (
    <div className={styles.trackMain}>
      <div className={styles.leftSide}>
        <div className={styles.header}>
          <CommentsInput />
          <ListenEngagement />
        </div>
        <div className={styles.infoComments}>
          <ListenArtistInfo />
          <div>
            <AudioInfo />
            <Comments />
          </div>
        </div>
      </div>
      <div className={styles.side}>
        <RelatedTracks />
        <InPlaylists />
        <LikeUsers />
        <RepostUsers />
      </div>
    </div>
  );
};

export default TrackMain;
