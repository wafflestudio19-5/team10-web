import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import styles from "./SetPage.module.scss";
import SetHeader from "./Header/SetHeader";
import SetModal from "./Modal/SetModal";
import SetMain from "./Main/SetMain";
import { useAuthContext } from "../../../context/AuthContext";
import SetEditModal from "./Modal/SetEditModal";
import toast from "react-hot-toast";

interface ISetParams {
  username: string;
  playlist: string;
}
export interface ISetTrack {
  artist: number;
  audio: string;
  play_count: number;
  id: number;
  image: string;
  is_liked: boolean;
  is_reposted: boolean;
  permalink: string;
  title: string;
  artist_display_name: string;
  artist_permalink: string;
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
  } | null;
  tags: ITag[];
  is_private: boolean;
  like_count: number;
  repost_count: number;
  image: string | null;
  tracks: ISetTrack[];
  created_at: string;
  is_followed: boolean | undefined;
  is_liked: boolean | undefined;
  is_reposted: boolean | undefined;
  track_count: number;
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
    image: null,
    tracks: [],
    created_at: "",
    is_followed: undefined,
    is_liked: undefined,
    is_reposted: undefined,
    track_count: 0,
  });
  const [noSet, setNoSet] = useState(false);
  const [isMySet, setIsMySet] = useState<undefined | boolean>(undefined);
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
      try {
        const config: any = {
          method: "get",
          url: `/sets/${data.id}`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        const response = await axios(config);
        if (response.data.creator.id == userSecret.id) {
          setIsMySet(true);
        } else {
          setIsMySet(false);
        }
        if (
          response.data.creator.id !== userSecret.id &&
          response.data.is_private
        ) {
          setNoSet(true);
        }
        setSet(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("플레이리스트 정보를 받아올 수 없습니다");
      }
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
      toast.error("플레이리스트 정보를 받아오는 데 실패했습니다");
    }
  };
  useEffect(() => {
    if (typeof userSecret.jwt === "string") {
      fetchSet();
    }
  }, [userSecret.jwt]);

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
              isMySet={isMySet}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default SetPage;
