import React from "react";
import TrackMain from "./Main/TrackMain";
import TrackHeader from "./Header/TrackHeader";
import styles from "./TrackPage.module.scss";

const TrackPage = () => {
  return (
    <div className={styles.track}>
      <TrackHeader />
      <TrackMain />
    </div>
  );
};

export default TrackPage;
