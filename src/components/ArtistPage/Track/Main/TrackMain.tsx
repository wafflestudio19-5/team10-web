import React, { useEffect, useRef, useState } from "react";
import AudioInfo from "./AudioInfo";
import CommentsInput from "./Comments/CommentsInput";
import ListenArtistInfo from "./ListenArtistInfo";
import ListenEngagement from "./ListenEngagement";
import Comments from "./Comments/Comments";
import styles from "./TrackMain.module.scss";
// import RelatedTracks from "./Side/RelatedTracks";
import RepostUsers from "./Side/RepostUsers";
import LikeUsers from "./Side/LikeUsers";
// import InPlaylists from "./Side/InPlaylists";
import { IArtist, ITrack, IUserMe } from "../TrackPage";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";

export interface IComment {
  id: number;
  group: number;
  writer: {
    id: number;
    permalink: string;
    display_name: string;
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
}
export interface ITrackReposter {
  id: number;
  permalink: string;
  display_name: string;
  email: string;
  image_profile: string;
  follower_count: number;
  track_count: number;
  first_name: string;
  last_name: string;
}

const TrackMain = ({
  track,
  artist,
  fetchTrack,
  userMe,
  isMyTrack,
  setEditModal,
}: {
  track: ITrack;
  artist: IArtist;
  userMe: IUserMe;
  fetchTrack: () => void;
  isMyTrack: boolean | undefined;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [trackLikers, setTrackLikers] = useState<ITrackReposter[]>([]);
  const [likersCount, setLikersCount] = useState(0);
  const [trackReposters, setTrackReposters] = useState<ITrackReposter[]>([]);
  const [repostersCount, setRepostersCount] = useState(0);
  const [isFinalComment, setIsFinalComment] = useState(false);
  const nextPage = useRef(1);
  const finalPage = useRef(0);

  const { userSecret } = useAuthContext();

  const fetchComments = async () => {
    const config: any = {
      method: "get",
      url: `/tracks/${track.id}/comments?page=${1}&page_size=${30}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      const data = response.data;
      setCommentCount(data.count);
      setComments(data.results);
      if (data.next) {
        // 다음 페이지가 있다면 nextPage에 다음 코멘트 페이지 저장
        nextPage.current += 1;
      } else {
        // 다음 페이지가 없다면 현재 nextPage 값 === 현재 받아온 코멘트 페이지 를 마지막 페이지로 저장
        finalPage.current = nextPage.current;
        setIsFinalComment(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchNextComments = async () => {
    if (nextPage.current !== finalPage.current) {
      const config: any = {
        method: "get",
        url: `/tracks/${track.id}/comments?page=${
          nextPage.current
        }&page_size=${30}`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        const response = await axios(config);
        const data = response.data;
        setCommentCount(data.count);
        setComments(comments.concat(data.results));
        if (data.next) {
          // 다음 페이지가 있다면 nextPage에 다음 코멘트 페이지 저장
          nextPage.current += 1;
        } else {
          // 다음 페이지가 없다면 현재 nextPage 값 === 현재 받아온 코멘트 페이지 를 마지막 페이지로 저장
          finalPage.current = nextPage.current;
          setIsFinalComment(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchCommentsAgain = async () => {
    const currentPage =
      nextPage.current === finalPage.current
        ? finalPage.current
        : nextPage.current - 1;
    const refetchedComments = [];
    for (let i = 1; i <= currentPage; i++) {
      const config: any = {
        method: "get",
        url: `/tracks/${track.id}/comments?page=${i}&page_size=${30}`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        const response = await axios(config);
        setCommentCount(response.data.count);
        refetchedComments.push(...response.data.results);
        console.log(refetchedComments);
      } catch (error) {
        console.log(error);
      }
    }
    setComments([...refetchedComments]);
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      fetchNextComments();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const fetchLikers = async () => {
    const config: any = {
      method: "get",
      url: `/tracks/${track.id}/likers?page=${1}&page_size=${9}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const { data } = await axios(config);
      setLikersCount(data.count);
      setTrackLikers(data.results);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchReposters = async () => {
    const config: any = {
      method: "get",
      url: `/tracks/${track.id}/reposters?page=${1}&page_size=${9}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const { data } = await axios(config);
      setRepostersCount(data.count);
      setTrackReposters(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchReposters();
    fetchLikers();
  }, []);

  return (
    <div className={styles.trackMain}>
      <div className={styles.leftSide}>
        <div className={styles.header}>
          <CommentsInput
            fetchComments={fetchCommentsAgain}
            track={track}
            userMe={userMe}
          />
          <ListenEngagement
            track={track}
            artist={artist}
            userMe={userMe}
            fetchTrack={fetchTrack}
            isMyTrack={isMyTrack}
            setEditModal={setEditModal}
            fetchLikers={fetchLikers}
            fetchReposters={fetchReposters}
          />
        </div>
        <div className={styles.infoComments}>
          <ListenArtistInfo
            artist={artist}
            userMe={userMe}
            isMyTrack={isMyTrack}
          />
          <div>
            {track.description && (
              <AudioInfo
                description={track.description}
                isPrivate={track.is_private}
              />
            )}
            <Comments
              comments={comments}
              track={track}
              fetchComments={fetchCommentsAgain}
              userMe={userMe}
              commentCount={commentCount}
              isFinalComment={isFinalComment}
            />
          </div>
        </div>
      </div>
      <div className={styles.side}>
        {/* <RelatedTracks />
        <InPlaylists /> */}
        <LikeUsers
          track={track}
          artist={artist}
          trackLikers={trackLikers}
          likersCount={likersCount}
        />
        <RepostUsers
          track={track}
          artist={artist}
          trackReposters={trackReposters}
          repostersCount={repostersCount}
        />
      </div>
    </div>
  );
};

export default TrackMain;
