import MostItems from "./MostItems";
import styles from "./MostList.module.scss";

const MostList = ({
  mostTrackList,
  likeListId,
  setLikeList,
  setLikeCount,
  togglePlayPause,
  playMusic,
}: {
  mostTrackList: any;
  likeListId: any;
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
          likeListId={likeListId}
          trackPermalink={item.permalink}
          artistPermalink={item.artist.permalink}
          setLikeList={setLikeList}
          setLikeCount={setLikeCount}
          togglePlayPause={togglePlayPause}
          track={item}
          playMusic={playMusic}
        />
      ))}
    </div>
  );
};

export default MostList;
