import React from "react";
import TrackPage from "./components/ArtistPage/Track/TrackPage";
import Header from "./components/Header/Header";
import styles from "./App.module.scss";
import Discover from "./components/Discover/Discover";

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <TrackPage />
    </div>
  );
}

export default App;
