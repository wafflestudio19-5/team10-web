import React, { useEffect, useState } from "react";
import styles from "./ListenArtistInfo.module.scss";
import { BsPeopleFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { RiUserFollowFill } from "react-icons/ri";
import { MdReport } from "react-icons/md";
import { useHistory } from "react-router";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { IArtist } from "../TrackPage";

interface IArtistInfo {
  image: string;
  followers: number;
  tracks: number;
}
const ListenArtistInfo = ({ artist }: { artist: IArtist }) => {
  const [artistInfo, setArtistInfo] = useState<IArtistInfo>({
    image: "",
    followers: 0,
    tracks: 0,
  });

  const { userSecret } = useAuthContext();

  const history = useHistory();
  const { permalink, display_name } = artist;
  const clickUsername = () => history.push(`/${permalink}`);
  const clickFollowers = () => history.push(`/${permalink}/followers`);
  const clickTracks = () => history.push(`/${permalink}/tracks`);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`/users/${artist.id}/followers`);
        console.log("유저", response.data);
        const data = response.data;
        setArtistInfo({
          ...artistInfo,
          followers: data.length,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (artist.id !== 0) {
      fetchArtist();
    }
  }, [artist]);
  console.log(artistInfo.followers);
  const followUser = async () => {
    try {
      await axios.get(
        `/resolve?url=https%3A%2F%2Fwww.soundwaffle.com%2F${userSecret.permalink}`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const linkParts = error.response.data.link.split(
          "api.soundwaffle.com/"
        ); // ['https://', 'users/3']
        try {
          const response = await axios.get(`/${linkParts[1]}/followings`);
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.profileImg} onClick={clickUsername}>
        <img
          src={artistInfo.image}
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
      <button onClick={followUser}>
        <RiUserFollowFill />
        <span>Follow</span>
      </button>
      <a>
        <MdReport />
        <span>Report</span>
      </a>
    </div>
  );
};

export default ListenArtistInfo;
