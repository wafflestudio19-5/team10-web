import axios from "axios";
import { useEffect, useState } from "react";
import NewItems from "./NewItems";
import styles from "./NewList.module.scss";

const NewList = ({ listScroll }: any) => {
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
        <NewItems
          title={item.title}
          img={item.image}
          key={item.id}
          trackIid={item.id}
        />
      ))}
    </div>
  );
};

export default NewList;
