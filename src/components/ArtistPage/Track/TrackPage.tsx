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

export interface ITrack {
  id: number;
  title: string;
  permalink: string;
  audio: string;
  comment_count: number;
  count: number;
  created_at: string;
  description: string;
  genre: null | string;
  image: null | string;
  like_count: number;
  repost_count: number;
  tags: string[];
  is_private: boolean;
  audio_length: number;
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
    count: 0,
    created_at: "",
    description: "",
    genre: null,
    image: "",
    like_count: 0,
    repost_count: 0,
    tags: [],
    is_private: false,
    audio_length: 0,
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
  const [isMyTrack, setIsMyTrack] = useState<boolean | undefined>(false);
  const [editModal, setEditModal] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);

  const { userSecret } = useAuthContext();
  const { username, trackname } = useParams<IParams>();
  useEffect(() => {
    if (username === userSecret.permalink) {
      setIsMyTrack(true);
    } else if (username !== userSecret.permalink && track.is_private) {
      setNoTrack(true);
    }
  }, [userSecret.permalink, track.is_private, isLoading]);

  const fetchTrack = async () => {
    const encoded = encodeURI(
      `https://www.soundwaffle.com/${username}/${trackname}`
    );
    try {
      const response = await axios.get(
        `https://api.soundwaffle.com/resolve?url=${encoded}`
      );
      const data = response.data;
      const artist = response.data.artist;
      const tagList = data.tags.map((value: ITag) => value.name);
      setTrack({
        id: data.id,
        title: data.title,
        permalink: data.permalink,
        audio: data.audio,
        comment_count: data.comment_count,
        count: data.count,
        created_at: data.created_at,
        description: data.description,
        genre: data.genre,
        image: data.image,
        like_count: data.like_count,
        repost_count: data.repost_count,
        tags: tagList,
        is_private: data.is_private,
        audio_length: 0,
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
    }
    return;
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
    fetchTrack();
  }, []);
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
