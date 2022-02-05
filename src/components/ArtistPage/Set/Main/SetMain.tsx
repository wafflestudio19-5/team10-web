import React from "react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../../context/AuthContext";
import { ITrackReposter } from "../../Track/Main/TrackMain";
import { IPlaylist } from "../SetPage";
import CreatorInfo from "./CreatorInfo";
import SetDescription from "./SetDescription";
import SetEngagement from "./SetEngagement";
import styles from "./SetMain.module.scss";
import axios from "axios";
import LikeUsers from "../../Track/Main/Side/LikeUsers";
import RepostUsers from "../../Track/Main/Side/RepostUsers";
import TrackList from "./TrackList";
import toast from "react-hot-toast";

const SetMain = ({
  playlist,
  fetchSet,
  setEditModal,
  playing,
  setPlaying,
  isMySet,
}: {
  playlist: IPlaylist;
  fetchSet: () => void;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  playing: string;
  setPlaying: React.Dispatch<React.SetStateAction<string>>;
  isMySet: boolean | undefined;
}) => {
  //   const [isMySet, setIsMySet] = useState<undefined | boolean>(undefined);
  const [setLikers, setSetLikers] = useState<ITrackReposter[]>([]);
  const [likersCount, setLikersCount] = useState(0);
  const [setReposters, setSetReposters] = useState<ITrackReposter[]>([]);
  const [repostersCount, setRepostersCount] = useState(0);
  const { userSecret } = useAuthContext();
  //   useEffect(() => {
  //     if (playlist.creator.id === userSecret.id) {
  //       setIsMySet(true);
  //     } else {
  //       setIsMySet(false);
  //     }
  //   }, [userSecret.id]);
  const fetchLikers = async () => {
    const config: any = {
      method: "get",
      url: `/sets/${playlist.id}/likers`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: { page: 1, page_size: 9 },
    };
    try {
      const { data } = await axios(config);
      setLikersCount(data.count);
      setSetLikers(data.results);
    } catch (error) {
      console.log(error);
      toast.error(
        "해당 플레이리스트를을 좋아요한 유저 목록을 받아올 수 없습니다"
      );
    }
  };
  const fetchReposters = async () => {
    const config: any = {
      method: "get",
      url: `/sets/${playlist.id}/reposters`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: { page: 1, page_size: 9 },
    };
    try {
      const { data } = await axios(config);
      setRepostersCount(data.count);
      setSetReposters(data.results);
    } catch (error) {
      console.log(error);
      toast.error(
        "해당 플레이리스트를 리포스트한 유저 목록을 받아올 수 없습니다"
      );
    }
  };

  useEffect(() => {
    fetchReposters();
    fetchLikers();
  }, []);
  return (
    <div className={styles.trackMain}>
      <div className={styles.leftSide}>
        <div className={styles.header}>
          <SetEngagement
            playlist={playlist}
            isMySet={isMySet}
            fetchSet={fetchSet}
            fetchLikers={fetchLikers}
            fetchReposters={fetchReposters}
            setEditModal={setEditModal}
          />
        </div>
        <div className={styles.infoComments}>
          <CreatorInfo playlist={playlist} isMySet={isMySet} />
          <div>
            {playlist.description && <SetDescription playlist={playlist} />}
            <ul className={styles.trackList}>
              {playlist?.tracks?.map((track) => {
                return (
                  <TrackList
                    track={track}
                    playlist={playlist}
                    key={track.id}
                    playing={playing}
                    setPlaying={setPlaying}
                    fetchSet={fetchSet}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.side}>
        {/* <RelatedTracks />
      <InPlaylists /> */}
        <LikeUsers
          //   track={track}
          //   artist={artist}
          trackLikers={setLikers}
          likersCount={likersCount}
        />
        <RepostUsers
          //   track={track}
          //   artist={artist}
          trackReposters={setReposters}
          repostersCount={repostersCount}
        />
      </div>
    </div>
  );
};
export default SetMain;
