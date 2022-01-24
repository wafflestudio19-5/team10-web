import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import styles from "./SetPage.module.scss";
import SetHeader from "./Header/SetHeader";
import SetModal from "./Modal/SetModal";
import SetMain from "./Main/SetMain";
import { useAuthContext } from "../../../context/AuthContext";
import SetEditModal from "./Modal/SetEditModal";

interface ISetParams {
  username: string;
  playlist: string;
}
export interface ISetTrack {
  artist: number;
  audio: string;
  count: number;
  id: number;
  image: string;
  is_liked: boolean;
  is_reposted: boolean;
  permalink: string;
  title: string;
}
interface ITag {
  id: number;
  name: string;
}
export interface IPlaylist {
  id: number;
  title: string;
  creator: {
    id: number;
    permalink: string;
    display_name: string;
    // email: string,
    image_profile: string;
    follower_count: number;
    track_count: number;
  };
  permalink: string;
  type: "playlist" | "album";
  description: string;
  genre: {
    id: number;
    name: string;
  };
  tags: ITag[];
  is_private: boolean;
  like_count: number;
  repost_count: number;
  image: string;
  tracks: ISetTrack[];
  created_at: string;
}

const SetPage = () => {
  const [set, setSet] = useState<IPlaylist>({
    id: 0,
    title: "",
    creator: {
      id: 0,
      permalink: "",
      display_name: "",
      // email: string,
      image_profile: "",
      follower_count: 0,
      track_count: 0,
    },
    permalink: "",
    type: "playlist",
    description: "",
    genre: {
      id: 0,
      name: "",
    },
    tags: [
      // {
      //   id: 0,
      //   name: "",
      // },
    ],
    is_private: false,
    like_count: 0,
    repost_count: 0,
    image: "",
    tracks: [],
    created_at: "",
  });
  const [noSet, setNoSet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [playing, setPlaying] = useState("before");
  const { username, playlist } = useParams<ISetParams>();
  const { userSecret } = useAuthContext();
  const fetchSet = async () => {
    try {
      const response = await axios.get(
        `/resolve?url=https%3A%2F%2Fsoundwaffle.com%2F${username}%2Fsets%2F${playlist}`
      );
      const data = response.data;
      setSet(data);
      console.log(data);
      setIsLoading(false);
    } catch (error) {
      if (
        (axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 404) ||
        (axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400)
      ) {
        setNoSet(true);
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchSet();
  }, []);

  useEffect(() => {
    if (set.creator.id !== userSecret.id && set.is_private === true) {
      setNoSet(true);
    }
  }, [userSecret.id, set.is_private, isLoading]);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <div className={styles.setWrapper}>
      {editModal === true && (
        <SetEditModal
          setModal={setEditModal}
          playlist={set}
          fetchSet={fetchSet}
        />
      )}
      {/* {playlistModal === true && (
    <PlaylistModal
      modal={playlistModal}
      closeModal={closePlaylistModal}
      track={track}
      artist={artist}
    />
  )} */}
      {isLoading || (
        <div className={styles.set}>
          <SetModal modal={modal} closeModal={closeModal} playlist={set} />
          <SetHeader
            openModal={openModal}
            playlist={set}
            noSet={noSet}
            playing={playing}
            setPlaying={setPlaying}
          />
          {noSet || (
            <SetMain
              playlist={set}
              fetchSet={fetchSet}
              setEditModal={setEditModal}
              playing={playing}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default SetPage;
