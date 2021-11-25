import React, { useState } from "react";
import TrackMain from "./Main/TrackMain";
import TrackHeader from "./Header/TrackHeader";
import styles from "./TrackPage.module.scss";
import TrackModal from "./Modal/TrackModal";

// interface Track {
//   title: string;
//   artist: string;
//   created_at: Date;
//   description: string;
//   image: string | null;
//   count: number;
//   tags: string[];
//   is_private: boolean;
// }
const TrackPage = () => {
  //   const track: Track = {
  //     title: "Title",
  //     artist: "Artist",
  //     created_at: new Date(2021, 11, 20),
  //     description: "descriptions",
  //     image: null,
  //     count: 0,
  //     tags: ["#Piano"],
  //     is_private: false,
  //   };
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <div className={styles.track}>
      <TrackModal modal={modal} closeModal={closeModal} />
      <TrackHeader openModal={openModal} />
      <TrackMain />
    </div>
  );
};

export default TrackPage;
