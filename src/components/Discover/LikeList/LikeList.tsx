import { useEffect, useState } from "react";
import LikeItems from "./LikeItems";

const LikeList = () => {
  const [likedTrackList, setLikedTrackList] = useState([
    {
      title: "Stay",
      img: "https://image.bugsm.co.kr/album/images/500/6221/622131.jpg",
      id: 1,
      artist: "The Kid LAROI",
      count: 312,
      like: 421,
      comment: 3,
      repost: 52,
    },
    {
      title: "리무진 (Feat. MINO)",
      img: "https://image.bugsm.co.kr/album/images/1000/204336/20433609.jpg",
      id: 2,
      artist: "BE'O",
      count: 321,
      like: 123,
      comment: 12,
      repost: 32,
    },
    {
      title: "strawberry moon",
      img: "https://image.bugsm.co.kr/album/images/1000/40662/4066238.jpg",
      id: 3,
      artist: "IU",
      count: 532,
      like: 123,
      comment: 43,
      repost: 123,
    },
    {
      title: "Stay",
      img: "https://image.bugsm.co.kr/album/images/500/6221/622131.jpg",
      id: 4,
      artist: "The Kid LAROI",
      count: 321,
      like: 123,
      comment: 3,
      repost: 412,
    },
  ]);
  useEffect(() => {
    //setMostTrackList안쓰면 오류나서 일시적으로 해놓은 코드
    if (likedTrackList[0].id >= 1000) {
      setLikedTrackList([...likedTrackList]);
    }
  }, []);
  return (
    <>
      {likedTrackList.map((item) => (
        <LikeItems
          title={item.title}
          img={item.img}
          artist={item.artist}
          count={item.count}
          like={item.like}
          comment={item.comment}
          repost={item.repost}
          key={item.id}
        />
      ))}
    </>
  );
};

export default LikeList;
