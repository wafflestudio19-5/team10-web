import React, { useEffect, useState } from "react";
import TrackMain from "./Main/TrackMain";
import TrackHeader from "./Header/TrackHeader";
import styles from "./TrackPage.module.scss";
import TrackModal from "./Modal/TrackModal";
import TrackBar from "./TrackBar/TrackBar";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  image: string;
  like_count: number;
  repost_count: number;
  tags: string[];
}
export interface IArtist {
  city: string;
  country: string;
  display_name: string;
  id: number;
  permalink: string;
}
interface IParams {
  username: string;
  trackname: string;
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
  });
  const [artist, setArtist] = useState<IArtist>({
    city: "",
    country: "",
    display_name: "",
    id: 0,
    permalink: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const { username, trackname } = useParams<IParams>();
  const fetchTrack = async () => {
    try {
      const response = await axios.get(
        `https://api.soundwaffle.com/resolve?url=https%3A%2F%2Fwww.soundwaffle.com%2F${username}%2F${trackname}`
      );
      const data = response.data;
      const artist = response.data.artist;
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
        tags: data.tags,
      });
      setArtist({
        city: artist.city,
        country: artist.country,
        display_name: artist.display_name,
        id: artist.id,
        permalink: artist.permalink,
      });
      setIsLoading(false);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 404
      ) {
        setNoTrack(true);
      }
    }
    return;
  };
  useEffect(() => {
    fetchTrack();
  }, []);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <div className={styles.trackWrapper}>
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
            <TrackMain track={track} artist={artist} fetchTrack={fetchTrack} />
          )}
          {noTrack || <TrackBar />}
        </div>
      )}
    </div>
  );
};

export default TrackPage;
