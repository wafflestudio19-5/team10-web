import NewItems from "./NewItems";
import styles from "./NewList.module.scss";

const NewList = ({
  listScroll,
  newTrackList,
  setLikeList,
  setLikeCount,
  togglePlayPause,
  playMusic,
}: {
  listScroll: any;
  newTrackList: any;
  setLikeList: any;
  setLikeCount: any;
  togglePlayPause: any;
  playMusic: any;
}) => {
  return (
    <div className={styles.newList} ref={listScroll}>
      {newTrackList.map((item: any) => (
        <NewItems
          title={item.title}
          img={item.image}
          key={item.id}
          trackId={item.id}
          trackPermalink={item.permalink}
          artistPermalink={item.artist.permalink}
          setLikeList={setLikeList}
          setLikeCount={setLikeCount}
          togglePlayPause={togglePlayPause}
          track={item}
          playMusic={playMusic}
          is_liked={item.is_liked}
        />
      ))}
    </div>
  );
};

export default NewList;
