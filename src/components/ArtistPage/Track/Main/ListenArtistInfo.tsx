import React from "react";
import styles from "./ListenArtistInfo.module.scss";
import { BsPeopleFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { RiUserFollowFill, RiUserUnfollowLine } from "react-icons/ri";
import { useHistory } from "react-router";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { IArtist, ITrack, IUserMe } from "../TrackPage";
import toast from "react-hot-toast";

// interface IArtistInfo {
//   image: null | string;
//   followers: number;
//   tracks: number;
// }
export interface IFollowings {
  id: number;
}
const ListenArtistInfo = ({
  artist,
  //   userMe,
  isMyTrack,
  //   setArtist,
  track,
  fetchTrack,
}: {
  artist: IArtist;
  userMe: IUserMe;
  isMyTrack: boolean | undefined;
  setArtist: React.Dispatch<React.SetStateAction<IArtist>>;
  track: ITrack;
  fetchTrack: () => void;
}) => {
  //   const [artistInfo, setArtistInfo] = useState<IArtistInfo>({
  //     image: null,
  //     followers: 0,
  //     tracks: 0,
  //   });
  //   const [followArtist, setFollowArtist] = useState(false);
  //   const [followLoading, setFollowLoading] = useState(true);

  const { userSecret } = useAuthContext();

  const history = useHistory();
  const { permalink, display_name } = artist;
  const clickUsername = () => history.push(`/${permalink}`);
  //   const clickFollowers = () => history.push(`/${permalink}/followers`);
  //   const clickTracks = () => history.push(`/${permalink}/tracks`);

  //   const fetchArtist = async () => {
  //     if (artist.id !== 0) {
  //       const config: any = {
  //         method: "get",
  //         url: `/users/${artist.id}`,
  //         headers: {
  //           Authorization: `JWT ${userSecret.jwt}`,
  //         },
  //         data: {},
  //       };
  //       try {
  //         const response = await axios(config);
  //         const data = response.data;
  //         setArtist({
  //           ...artist,

  //           follower_count: data.follower_count,
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };
  //   const isFollowing = async () => {
  //     if (artist.id !== 0 && userMe.id !== 0) {
  //       const followConfig: any = {
  //         method: "get",
  //         url: `/users/${userMe.id}/followings`,
  //         headers: {
  //           Authorization: `JWT ${userSecret.jwt}`,
  //         },
  //         data: {},
  //       };
  //       try {
  //         const { data } = await axios(followConfig);
  //         if (data.results.length === 0) {
  //           setFollowLoading(false);
  //         } else {
  //           const trackExist = data.results.find(
  //             (following: IFollowings) => following.id === artist.id
  //           );
  //           if (trackExist) {
  //             setFollowArtist(true);
  //           }
  //           setFollowLoading(false);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };
  //   //   useEffect(() => {
  //   //     fetchArtist();
  //   //   }, [artist]);
  //   useEffect(() => {
  //     isFollowing();
  //   }, [userMe, userSecret]);

  const followUser = async () => {
    const config: any = {
      method: "post",
      url: `/users/me/followings/${artist.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      await axios(config);
      fetchTrack();
    } catch (error) {
      console.log(error);
      toast.error("유저를 팔로우하는데 실패했습니다");
    }
  };
  const unfollowUser = async () => {
    const config: any = {
      method: "delete",
      url: `/users/me/followings/${artist.id}`,
      headers: {
        Authorization: `JWT ${userSecret.jwt}`,
      },
      data: {},
    };
    try {
      await axios(config);
      fetchTrack();
    } catch (error) {
      console.log(error);
      toast.error("유저를 언팔로우하는데 실패했습니다");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.profileImg} onClick={clickUsername}>
        <img
          src={artist.image_profile || "/default_user_image.png"}
          alt={`${artist.display_name}의 프로필 사진`}
        />
      </div>
      <div className={styles.username} onClick={clickUsername}>
        {display_name}
      </div>
      <ul className={styles.userInfo}>
        <li
        // onClick={clickFollowers}
        >
          <BsPeopleFill />
          <span>{artist.follower_count}</span>
        </li>
        <li
        // onClick={clickTracks}
        >
          <IoStatsChart />
          <span>{artist.track_count}</span>
        </li>
      </ul>
      {isMyTrack === false && track.is_followed && (
        <button
          className={styles.unfollowArtist}
          onClick={unfollowUser}
          disabled={track.is_followed === undefined}
        >
          <RiUserUnfollowLine />
          <span>Following</span>
        </button>
      )}
      {isMyTrack === false && track.is_followed === false && (
        <button
          className={styles.followArtist}
          onClick={followUser}
          disabled={track.is_followed === undefined}
        >
          <RiUserFollowFill />
          <span>Follow</span>
        </button>
      )}
    </div>
  );
};

export default ListenArtistInfo;
