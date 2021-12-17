import React, { useState } from "react";
import TrackMain from "./Main/TrackMain";
import TrackHeader from "./Header/TrackHeader";
import styles from "./TrackPage.module.scss";
import TrackModal from "./Modal/TrackModal";
// import axios from "axios";

export interface ITrack {
  title: string;
  artist: string;
  permalink: string;
  image: string;
  audio: string;
  description: string;
  created_at: string;
  count: number;
  tags: string[];
  is_private: boolean;
  likes: number;
  reposts: number;
}
const TrackPage = () => {
  const [modal, setModal] = useState(false);
  // const [track, setTrack] = useState<ITrack>({
  //   title: "Title",
  //   artist: "aritst",
  //   permalink: "example",
  //   image:
  //     "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=800&q=60",
  //   audio:
  //     "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
  //   description: "트랙 정보",
  //   created_at: new Date().toString(),
  //   count: 0,
  //   tags: ["Piano"],
  //   is_private: false,
  //   likes: 2649,
  //   reposts: 1161,
  // });
  const track = {
    title: "Title",
    artist: "username",
    permalink: "example",
    image:
      "https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "트랙 정보",
    created_at: "1 year ago",
    count: 134565,
    tags: ["Piano"],
    is_private: false,
    likes: 2649,
    reposts: 1161,
  };

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  // useEffect(() => {
  //   const fetchTrack = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://api.soundwaffle.com/tracks/track_id`
  //       );
  //       const data = response.data;
  //       setTrack({
  //         title: data.title,
  //         artist: data.artist,
  //         permalink: data.permalink,
  //         image: data.image,
  //         audio: data.audio,
  //         description: data.description,
  //         created_at: data.date,
  //         count: data.count,
  //         tags: data.tags,
  //         is_private: data.is_private,
  //         likes: data.likes,
  //         reposts: data.resposts,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchTrack();
  // });

  return (
    <div className={styles.track}>
      <TrackModal modal={modal} closeModal={closeModal} track={track} />
      <TrackHeader openModal={openModal} track={track} />
      <TrackMain track={track} />
    </div>
  );
};

export default TrackPage;
