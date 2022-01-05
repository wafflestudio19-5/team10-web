import axios from "axios";
import { useEffect, useState } from "react";
import NewItems from "./NewItems";
import styles from "./NewList.module.scss";

const NewList = ({ listScroll, likeList }: any) => {
  const [newTrackList, setNewTrackList] = useState([
    {
      title: "",
      image: "",
      id: 999999,
    },
    {
      title: "",
      image: "",
      id: 999998,
    },
    {
      title: "",
      image: "",
      id: 999997,
    },
    {
      title: "",
      image: "",
      id: 999996,
    },
    {
      title: "",
      image: "",
      id: 999995,
    },
    {
      title: "",
      image: "",
      id: 999994,
    },
  ]);
  const [likeListId, setLikeListId] = useState([]);
  useEffect(() => {
    const fetchNewList = () => {
      axios.get("/tracks").then((r: any) => {
        const newList = r.data.results.splice(-6);
        setNewTrackList(newList);
      });
    };
    fetchNewList();
  }, []);
  useEffect(() => {
    if (likeList[0].id !== null) {
      setLikeListId(likeList.map((item: any) => item.id));
    }
  }, [likeList]);
  return (
    <div className={styles.newList} ref={listScroll}>
      {newTrackList.map((item) => (
        <NewItems
          title={item.title}
          img={item.image}
          key={item.id}
          trackId={item.id}
          likeListId={likeListId}
        />
      ))}
    </div>
  );
};

export default NewList;
