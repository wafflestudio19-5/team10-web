import React, { useEffect } from "react";
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
import { ITrack } from "../TrackPage";

export interface IComment {
  id: number;
  display_name: string;
  commented_at: string;
  content: string;
  created_at: string;
}

const TrackMain = ({ track }: { track: ITrack }) => {
  const { artist, description } = track;

  //   const [comments, setComments] = useState<IComment[]>([
  //     {
  //       id: 1,
  //       display_name: "김와플",
  //       commented_at: "0:14",
  //       content: "댓글",
  //       created_at: "1 day ago",
  //     },
  //     {
  //       id: 2,
  //       display_name: "박와플",
  //       commented_at: "0:14",
  //       content: "댓글",
  //       created_at: "2 day ago",
  //     },
  //     {
  //       id: 3,
  //       display_name: "이와플",
  //       commented_at: "0:14",
  //       content: "댓글",
  //       created_at: "3 day ago",
  //     },
  //     {
  //       id: 4,
  //       display_name: "김김김",
  //       commented_at: "0:14",
  //       content: "댓글",
  //       created_at: "4 day ago",
  //     },
  //   ]);

  const fetchComments = async () => {
    // try {
    //   const response = await axios.get(
    //     `https://api.soundwaffle.com/tracks/{track_id}/comments`
    //   );
    //   const data = response.data;
    //   setComments(data);
    // } catch (error) {
    //   console.log(error);
    // }
    return;
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const comments: IComment[] = [
    {
      id: 1,
      display_name: "김와플",
      commented_at: "0:14",
      content: "댓글",
      created_at: "1 day ago",
    },
    {
      id: 2,
      display_name: "박와플",
      commented_at: "0:14",
      content: "댓글",
      created_at: "2 day ago",
    },
    {
      id: 3,
      display_name: "이와플",
      commented_at: "0:14",
      content: "댓글",
      created_at: "3 day ago",
    },
    {
      id: 4,
      display_name: "김김김",
      commented_at: "0:14",
      content: "댓글",
      created_at: "4 day ago",
    },
  ];

  return (
    <div className={styles.trackMain}>
      <div className={styles.leftSide}>
        <div className={styles.header}>
          <CommentsInput fetchComments={fetchComments} />
          <ListenEngagement track={track} />
        </div>
        <div className={styles.infoComments}>
          <ListenArtistInfo artist={artist} />
          <div>
            <AudioInfo description={description} />
            <Comments comments={comments} />
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
