import React, { useEffect, useState } from "react";
import styles from "./ListenArtistInfo.module.scss";
import { BsPeopleFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { RiUserFollowFill, RiUserUnfollowLine } from "react-icons/ri";
import { useHistory } from "react-router";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { IArtist, IUserMe } from "../TrackPage";

interface IArtistInfo {
  image: string;
  followers: number;
  tracks: number;
}
export interface IFollowings {
  id: number;
}
const ListenArtistInfo = ({
  artist,
  userMe,
  isMyTrack,
}: {
  artist: IArtist;
  userMe: IUserMe;
  isMyTrack: boolean | undefined;
}) => {
  const [artistInfo, setArtistInfo] = useState<IArtistInfo>({
    image: "",
    followers: 0,
    tracks: 0,
  });
  const [followArtist, setFollowArtist] = useState(false);
  const [followLoading, setFollowLoading] = useState(true);

  const { userSecret } = useAuthContext();

  const history = useHistory();
  const { permalink, display_name } = artist;
  const clickUsername = () => history.push(`/${permalink}`);
  const clickFollowers = () => history.push(`/${permalink}/followers`);
  const clickTracks = () => history.push(`/${permalink}/tracks`);

  const fetchArtist = async () => {
    if (artist.id !== 0) {
      const config: any = {
        method: "get",
        url: `/users/${artist.id}`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        const response = await axios(config);
        const data = response.data;
        setArtistInfo({
          image: data.image_profile,
          followers: data.follower_count,
          tracks: data.track_count,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const isFollowing = async () => {
    if (artist.id !== 0 && userMe.id !== 0) {
      const followConfig: any = {
        method: "get",
        url: `/users/${userMe.id}/followings`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
      };
      try {
        const { data } = await axios(followConfig);
        if (data.results.length === 0) {
          setFollowLoading(false);
        } else {
          const trackExist = data.results.find(
            (following: IFollowings) => following.id === artist.id
          );
          if (trackExist) {
            setFollowArtist(true);
          }
          setFollowLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchArtist();
  }, [artist]);
  useEffect(() => {
    isFollowing();
  }, [userMe, userSecret]);

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
      const response = await axios(config);
      if (response) {
        setFollowArtist(true);
        fetchArtist();
      }
    } catch (error) {
      console.log(error);
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
      const response = await axios(config);
      if (response) {
        setFollowArtist(false);
        fetchArtist();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.profileImg} onClick={clickUsername}>
        <img
          src={artistInfo.image || "/default_user_image.png"}
          alt={`${artist.display_name}의 프로필 사진`}
        />
      </div>
      <div className={styles.username} onClick={clickUsername}>
        {display_name}
      </div>
      <ul className={styles.userInfo}>
        <li onClick={clickFollowers}>
          <BsPeopleFill />
          <span>{artistInfo.followers}</span>
        </li>
        <li onClick={clickTracks}>
          <IoStatsChart />
          <span>{artistInfo.tracks}</span>
        </li>
      </ul>
      {isMyTrack === false && followArtist && (
        <button className={styles.unfollowArtist} onClick={unfollowUser}>
          <RiUserUnfollowLine />
          <span>Following</span>
        </button>
      )}
      {isMyTrack === false && !followArtist && (
        <button
          className={styles.followArtist}
          onClick={followUser}
          disabled={followLoading}
        >
          <RiUserFollowFill />
          <span>Follow</span>
        </button>
      )}
    </div>
  );
};

export default ListenArtistInfo;
