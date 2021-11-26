import { useEffect, useState } from "react";
import MostItems from "./MostItems";
import styles from "./MostList.module.scss";

const MostList = () => {
  const [mostTrackList, setMostTrackList] = useState([
    {
      title: "Stay",
      img: "https://image.bugsm.co.kr/album/images/500/6221/622131.jpg",
      id: 1,
    },
    {
      title: "리무진 (Feat. MINO)",
      img: "https://image.bugsm.co.kr/album/images/1000/204336/20433609.jpg",
      id: 2,
    },
    {
      title: "strawberry moon",
      img: "https://image.bugsm.co.kr/album/images/1000/40662/4066238.jpg",
      id: 3,
    },
    {
      title: "Stay",
      img: "https://image.bugsm.co.kr/album/images/500/6221/622131.jpg",
      id: 4,
    },
  ]);
  useEffect(() => {
    //setMostTrackList안쓰면 오류나서 일시적으로 해놓은 코드
    if (mostTrackList[0].id >= 1000) {
      setMostTrackList([...mostTrackList]);
    }
  }, []);
  return (
    <div className={styles.mostList}>
      {mostTrackList.map((item) => (
        <MostItems title={item.title} img={item.img} />
      ))}
    </div>
  );
};

export default MostList;
