import React from "react";
import styles from "./SetDescription.module.scss";
import { BsFillFileLock2Fill } from "react-icons/bs";
import { IPlaylist } from "../SetPage";

const SetDescription = ({ playlist }: { playlist: IPlaylist }) => {
  return (
    <div className={styles.main}>
      {playlist.is_private && (
        <div className={styles.private}>
          <BsFillFileLock2Fill />
          {"  "}This playlist is private.
        </div>
      )}
      {playlist.description}
      {/* <button>Show more</button> */}
    </div>
  );
};

export default SetDescription;
