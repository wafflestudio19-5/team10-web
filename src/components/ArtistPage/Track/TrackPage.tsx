import React, { useEffect, useState } from "react";
import TrackMain from "./Main/TrackMain";
import TrackHeader from "./Header/TrackHeader";
import styles from "./TrackPage.module.scss";
import TrackModal from "./Modal/TrackModal";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import EditModal from "../../Upload/YourTracks/EditModal";
import PlaylistModal from "./Modal/PlaylistModal";
import toast from "react-hot-toast";

export interface ITrack {
  id: number;
  title: string;
  permalink: string;
  audio: string;
  comment_count: number;
  play_count: number;
  created_at: string;
  description: string;
  genre: null | ITag;
  image: null | string;
  like_count: number;
  repost_count: number;
  tags: string[];
  is_private: boolean;
  //   audio_length: number;
  is_liked: boolean | undefined;
  is_reposted: boolean | undefined;
  is_followed: boolean | undefined;
}
export interface IArtist {
  city: string;
  country: string;
  display_name: string;
  id: number;
  permalink: string;
  track_count: number;
  follower_count: number;
  image_profile: string | null;
}
export interface ITag {
  id: number;
  name: string;
}
interface IParams {
  username: string;
  trackname: string;
}
export interface IUserMe {
  id: number;
  image_profile: string;
}

const TrackPage = () => {
  const [modal, setModal] = useState(false);
  const [noTrack, setNoTrack] = useState(false);
  const [track, setTrack] = useState<ITrack>({
    id: 0,
    title: "",
    permalink: "",
    audio: "",
    comment_count: 0,
    play_count: 0,
    created_at: "",
    description: "",
    genre: null,
    image: "",
    like_count: 0,
    repost_count: 0,
    tags: [],
    is_private: false,
    // audio_length: 0,
    is_followed: undefined,
    is_reposted: undefined,
    is_liked: undefined,
  });
  const [artist, setArtist] = useState<IArtist>({
    city: "",
    country: "",
    display_name: "",
    id: 0,
    permalink: "",
    track_count: 0,
    follower_count: 0,
    image_profile: null,
  });
  const [userMe, setUserMe] = useState<IUserMe>({ id: 0, image_profile: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isMyTrack, setIsMyTrack] = useState<boolean | undefined>(undefined);
  const [editModal, setEditModal] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);

  const { userSecret } = useAuthContext();
  const { username, trackname } = useParams<IParams>();
  //   useEffect(() => {
  //     if (username === userSecret.permalink) {
  //       setIsMyTrack(true);
  //     } else if (username !== userSecret.permalink && track.is_private) {
  //       setNoTrack(true);
  //     }
  //   }, [userSecret.permalink, track.is_private, isLoading]);
  const fetchTrack = async () => {
    if (typeof userSecret.jwt === "string") {
      try {
        const config: any = {
          method: "get",
          url: `https://api.soundwaffle.com/resolve?url=https://www.soundwaffle.com/${username}/${trackname}`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
        };
        const response = await axios(config);
        const artist = response.data.artist;
        if (artist.id == userSecret.id) {
          setIsMyTrack(true);
        } else {
          setIsMyTrack(false);
        }
        const tagList = response.data.tags.map((value: ITag) => value.name);
        setTrack({
          id: response.data.id,
          title: response.data.title,
          permalink: response.data.permalink,
          audio: response.data.audio,
          comment_count: response.data.comment_count,
          play_count: response.data.play_count,
          created_at: response.data.created_at,
          description: response.data.description,
          genre: response.data.genre,
          image: response.data.image,
          like_count: response.data.like_count,
          repost_count: response.data.repost_count,
          tags: tagList,
          is_private: response.data.is_private,
          // audio_length: 0,
          is_liked: response.data.is_liked,
          is_reposted: response.data.is_reposted,
          is_followed: response.data.is_followed,
        });
        setArtist({
          city: artist.city,
          country: artist.country,
          display_name: artist.display_name,
          id: artist.id,
          permalink: artist.permalink,
          track_count: artist.track_count,
          follower_count: artist.follower_count,
          image_profile: artist.image_profile,
        });
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
          setNoTrack(true);
          setIsLoading(false);
        }
        toast.error("트랙 정보를 받아올 수 없습니다");
      }
    }
  };
  const fetchMe = async () => {
    if (userSecret.jwt) {
      const config: any = {
        method: "get",
        url: `/users/me`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        const { data } = await axios(config);
        setUserMe({ id: data.id, image_profile: data.image_profile });
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (typeof userSecret.jwt === "string") {
      fetchTrack();
    }
  }, [userSecret.jwt]);
  useEffect(() => {
    fetchMe();
  }, [userSecret.jwt]);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const openPlaylistModal = () => setPlaylistModal(true);
  const closePlaylistModal = () => setPlaylistModal(false);

  return (
    <div className={styles.trackWrapper}>
      {editModal === true && (
        <EditModal
          setModal={setEditModal}
          track={track}
          fetchYourTracks={fetchTrack}
        />
      )}
      {playlistModal === true && (
        <PlaylistModal
          modal={playlistModal}
          closeModal={closePlaylistModal}
          track={track}
          artist={artist}
        />
      )}
      {isLoading || (
        <div className={styles.track}>
          <TrackModal
            modal={modal}
            closeModal={closeModal}
            track={track}
            artist={artist}
          />
          <TrackHeader
            openModal={openModal}
            track={track}
            artist={artist}
            noTrack={noTrack}
          />
          {noTrack || (
            <TrackMain
              track={track}
              artist={artist}
              userMe={userMe}
              fetchTrack={fetchTrack}
              isMyTrack={isMyTrack}
              setEditModal={setEditModal}
              openPlaylistModal={openPlaylistModal}
              setArtist={setArtist}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TrackPage;
