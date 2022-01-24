import React from "react";
import styles from "./SetEngagement.module.scss";
import { BsSuitHeartFill } from "react-icons/bs";
import { BiRepost, BiPencil } from "react-icons/bi";
// import { ImShare } from "react-icons/im";
import { FiLink2 } from "react-icons/fi";
// import { FaPlay } from "react-icons/fa";
// import { MdPlaylistAdd } from "react-icons/md";
// import { useHistory } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../../context/AuthContext";
import { IPlaylist } from "../SetPage";
import { MdDelete } from "react-icons/md";
import { useHistory } from "react-router";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export interface ILikeTrack {
  id: number;
}

const SetEngagement = ({
  playlist,
  isMySet,
  fetchSet,
  fetchLikers,
  fetchReposters,
  setEditModal,
}: {
  playlist: IPlaylist;
  isMySet: undefined | boolean;
  fetchSet: () => void;
  fetchLikers: () => void;
  fetchReposters: () => void;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //     const [like, setLike] = useState(false);
  //   const [repost, setRepost] = useState(false);
  const history = useHistory();
  const { userSecret } = useAuthContext();

  const likeSet = async () => {
    const config: any = {
      method: "post",
      url: `/likes/sets/${playlist.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      if (response) {
        console.log("asdfsadj");
        // setLike(true);
        fetchSet();
        fetchLikers();
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error &&
        error?.response?.status === 401
      ) {
        console.log("Unauthorized");
      }
    }
  };

  const unlikeSet = async () => {
    const config: any = {
      method: "delete",
      url: `/likes/sets/${playlist.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      const response = await axios(config);
      if (response) {
        // setLike(false);
        fetchSet();
        fetchLikers();
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error &&
        error?.response?.status === 401
      ) {
        console.log("asdfasd");
      }
    }
  };
  const repostSet = async () => {
    console.log(axios.defaults.headers);
    const config: any = {
      method: "post",
      url: `/reposts/sets/${playlist.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      await axios(config);
      //   setRepost(true);
      fetchSet();
      fetchReposters();
    } catch (error) {
      console.log(error);
    }
    return;
  };
  const unrepostSet = async () => {
    const config: any = {
      method: "delete",
      url: `/reposts/sets/${playlist.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      await axios(config);
      //   setRepost(false);
      fetchSet();
      fetchReposters();
    } catch (error) {
      console.log(error);
    }
    return;
  };
  const copyLink = async () => {
    await navigator.clipboard.writeText(location.href);
    toast.success("Link has been copied to the clipboard!");
  };
  //   const editTrack = () => {
  //     setEditModal(true);
  //   };

  //   const trackLikes = () =>
  //     history.push(`/${artist.permalink}/${track.permalink}/likes`);
  //   const trackReposts = () =>
  //     history.push(`/${artist.permalink}/${track.permalink}/reposts`);
  const removeSet = async () => {
    confirmAlert({
      message: "Do you really want to remove this playlist?",
      buttons: [
        {
          label: "Cancel",
          onClick: () => {
            return null;
          },
        },
        {
          label: "Yes",
          onClick: async () => {
            const config: any = {
              method: "delete",
              url: `/sets/${playlist.id}`,
              headers: {
                Authorization: `JWT ${userSecret.jwt}`,
              },
              data: {},
            };
            try {
              await axios(config);
              toast.success("플레이리스트를 삭제했습니다");
              history.push(`/${userSecret.permalink}/sets`);
            } catch (error) {
              console.log(error);
              toast.error("플레이리스트를 삭제하는 데 실패했습니다");
            }
          },
        },
      ],
    });
  };
  const openEditModal = () => setEditModal(true);
  console.log(playlist);
  return (
    <div className={styles.main}>
      <div className={styles.buttonGroup}>
        {isMySet === false && playlist.is_liked === true && (
          <button className={styles.like} onClick={unlikeSet}>
            <BsSuitHeartFill />
            <span>Liked</span>
          </button>
        )}
        {isMySet === false && playlist.is_liked === false && (
          <button className={styles.notLike} onClick={likeSet}>
            <BsSuitHeartFill />
            <span>Like</span>
          </button>
        )}
        {isMySet === false && playlist.is_reposted === true && (
          <button className={styles.repost} onClick={unrepostSet}>
            <BiRepost />
            <span>Reposted</span>
          </button>
        )}
        {isMySet === false && playlist.is_reposted === false && (
          <button className={styles.notRepost} onClick={repostSet}>
            <BiRepost />
            <span>Repost</span>
          </button>
        )}
        {/* <button className={styles.share}>
          <ImShare />
          <span>Share</span>
        </button> */}
        <button className={styles.copyLink} onClick={copyLink}>
          <FiLink2 />
          <span>Copy Link</span>
        </button>
        {/* <button className={styles.more} onClick={openPlaylistModal}>
          <MdPlaylistAdd />
          <span>Add to Playlist</span>
        </button> */}
        {isMySet === true && (
          <button className={styles.edit} onClick={openEditModal}>
            <BiPencil />
            <span>Edit</span>
          </button>
        )}
        {isMySet === true && (
          <button className={styles.remove} onClick={removeSet}>
            <MdDelete />
            <span>Delete playlist</span>
          </button>
        )}
      </div>
      <div className={styles.stats}>
        {/* <div className={styles.playStats}>
          <FaPlay />
          <span>{track.count}</span>
        </div> */}
        <div className={styles.likeStats}>
          <BsSuitHeartFill />
          <span
            className={styles.pointer}
            //    onClick={trackLikes}
          >
            {playlist.like_count}
          </span>
        </div>
        <div className={styles.repostStats}>
          <BiRepost />
          <span
            className={styles.pointer}
            // onClick={trackReposts}
          >
            {playlist.repost_count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SetEngagement;
