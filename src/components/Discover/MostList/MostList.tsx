import MostItems from "./MostItems";
import styles from "./MostList.module.scss";

const MostList = ({
  mostTrackList,
  setLikeList,
  setLikeCount,
  togglePlayPause,
  playMusic,
}: {
  mostTrackList: any;
  setLikeList: any;
  setLikeCount: any;
  togglePlayPause: any;
  playMusic: any;
}) => {
  return (
    <div className={styles.mostList}>
      {mostTrackList.map((item: any) => (
        <MostItems
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

export default MostList;
