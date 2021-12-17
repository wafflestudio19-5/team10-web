import { useEffect, useState } from "react";
import NewItems from "./NewItems";
import styles from "./NewList.module.scss";

const NewList = ({ listScroll }: any) => {
  const [newTrackList, setNewTrackList] = useState([
    {
      title: "strawberry moon",
      img: "https://image.bugsm.co.kr/album/images/1000/40662/4066238.jpg",
      id: 3,
    },
    {
      title: "리무진 (Feat. MINO)",
      img: "https://image.bugsm.co.kr/album/images/1000/204336/20433609.jpg",
      id: 2,
    },
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
      title: "Stay",
      img: "https://image.bugsm.co.kr/album/images/500/6221/622131.jpg",
      id: 4,
    },
    {
      title: "strawberry moon",
      img: "https://image.bugsm.co.kr/album/images/1000/40662/4066238.jpg",
      id: 3,
    },
  ]);
  useEffect(() => {
    //setNewTrackList안쓰면 오류나서 일시적으로 해놓은 코드
    if (newTrackList[0].id >= 1000) {
      setNewTrackList([...newTrackList]);
    }
  }, []);

  return (
    <div className={styles.newList} ref={listScroll}>
      {newTrackList.map((item) => (
        <NewItems title={item.title} img={item.img} />
      ))}
    </div>
  );
};

export default NewList;
