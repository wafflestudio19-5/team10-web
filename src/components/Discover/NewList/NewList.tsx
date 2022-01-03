import axios from "axios";
import { useEffect, useState } from "react";
import NewItems from "./NewItems";
import styles from "./NewList.module.scss";

const NewList = ({ listScroll }: any) => {
  const [newTrackList, setNewTrackList] = useState([
    {
      title: "",
      image: "",
      id: 0,
    },
    {
      title: "",
      image: "",
      id: 1,
    },
    {
      title: "",
      image: "",
      id: 2,
    },
    {
      title: "",
      image: "",
      id: 3,
    },
    {
      title: "",
      image: "",
      id: 4,
    },
    {
      title: "",
      image: "",
      id: 5,
    },
  ]);
  useEffect(() => {
    const fetchNewList = () => {
      axios.get("/tracks").then((r: any) => {
        const newList = r.data.slice(-6);
        console.log(newList);
        setNewTrackList(newList);
      });
    };
    fetchNewList();
  }, []);

  return (
    <div className={styles.newList} ref={listScroll}>
      {newTrackList.map((item) => (
        <NewItems title={item.title} img={item.image} key={item.id} />
      ))}
    </div>
  );
};

export default NewList;
