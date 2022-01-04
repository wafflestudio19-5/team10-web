import React, { useEffect, useState } from "react";
import AudioInfo from "./AudioInfo";
import CommentsInput from "./Comments/CommentsInput";
import ListenArtistInfo from "./ListenArtistInfo";
import ListenEngagement from "./ListenEngagement";
import Comments from "./Comments/Comments";
import styles from "./TrackMain.module.scss";
import RelatedTracks from "./Side/RelatedTracks";
import RepostUsers from "./Side/RepostUsers";
import LikeUsers from "./Side/LikeUsers";
import InPlaylists from "./Side/InPlaylists";
import { IArtist, ITrack } from "../TrackPage";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";

export interface IComment {
  id: number;
  writer: {
    id: number;
    permalink: string;
    email: string;
    image_profile: string;
    follower_count: number;
    track_count: number;
    first_name: string;
    last_name: string;
  };
  content: string;
  created_at: string;
  commented_at: string;
  parent_comment: number;
}
export interface IUserMe {
  id: number;
  image_profile: string;
}

const TrackMain = ({
  track,
  artist,
  fetchTrack,
}: {
  track: ITrack;
  artist: IArtist;
  fetchTrack: () => void;
}) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [userMe, setUserMe] = useState<IUserMe>({ id: 0, image_profile: "" });
  const { userSecret } = useAuthContext();

  const fetchComments = async () => {
    const config: any = {
      method: "get",
      url: `/tracks/${track.id}/comments`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      const data = response.data;
      setComments(data);
    } catch (error) {
      console.log(error);
    }
    return;
  };
  const fetchMe = async () => {
    const config: any = {
      method: "get",
      url: `/users/me`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    if (userMe.id !== 0) {
      try {
        const { data } = await axios(config);
        setUserMe({
          id: data.id,
          image_profile: data.image_profile,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchComments();
    fetchMe();
  }, [track]);

  return (
    <div className={styles.trackMain}>
      <div className={styles.leftSide}>
        <div className={styles.header}>
          <CommentsInput fetchComments={fetchComments} track={track} />
          <ListenEngagement track={track} fetchTrack={fetchTrack} />
        </div>
        <div className={styles.infoComments}>
          <ListenArtistInfo artist={artist} />
          <div>
            <AudioInfo description={track.description} />
            <Comments comments={comments} track={track} />
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
