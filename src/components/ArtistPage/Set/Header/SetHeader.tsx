import { useRef, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useTrackContext } from "../../../../context/TrackContext";
import { IPlaylist } from "../SetPage";
import SetButton from "./SetButton";
import styles from "./SetHeader.module.scss";
import SetImage from "./SetImage";
import SetInfo from "./SetInfo";
import SetTag from "./SetTag";

const SetHeader = ({
  openModal,
  playlist,
  noSet,
}: {
  openModal: () => void;
  playlist: IPlaylist;
  noSet: boolean;
}) => {
  const [playing, setPlaying] = useState("before");
  const setHeader = useRef<HTMLDivElement>(null);
  const {
    setAudioSrc,
    setTrackIsPlaying,
    setTrackBarTrack,
    setTrackBarArtist,
    audioPlayer,
    setTrackBarPlaylist,
  } = useTrackContext();
  //   const buttonDisabled = noSet || setLoading;
  const buttonDisabled = false;
  const togglePlayPause = () => {
    if (playing === "before") {
      setPlaying("playing");
      setAudioSrc(playlist.tracks[0].audio);
      setTrackIsPlaying(true);
      setTrackBarArtist({
        display_name: playlist.creator.display_name,
        id: playlist.creator.id,
        permalink: playlist.creator.permalink,
      });
      setTrackBarTrack({
        id: playlist.tracks[0].id,
        title: playlist.tracks[0].title,
        permalink: playlist.tracks[0].permalink,
        audio: playlist.tracks[0].audio,
        image: playlist.tracks[0].image,
        // like_count: track.like_count,
        // repost_count: track.repost_count,
        // comment_count: track.comment_count,
        // genre: track.genre,
        // count: track.count,
        // is_private: track.is_private,
      });
      setTrackBarPlaylist(playlist.tracks);
      audioPlayer.current.src = playlist.tracks[0].audio;
      setTimeout(() => {
        audioPlayer.current.play();
      }, 1);
    } else if (playing === "playing") {
      setPlaying("paused");
      audioPlayer.current.pause();
    } else {
      setPlaying("playing");
      audioPlayer.current.play();
    }
  };

  return (
    <div>
      <div ref={setHeader} className={styles.setHeader}>
        <div className={styles.setInfo}>
          <SetButton
            togglePlayPause={togglePlayPause}
            playing={playing}
            buttonDisabled={buttonDisabled}
          />
          <SetInfo playlist={playlist} />
        </div>
        {noSet === true ? (
          <div className={styles.noSetFound}>
            <MdOutlineCancel />
            This playlist is not available anymore. It’s either been deleted or
            made private by the creator.
          </div>
        ) : (
          <div className={styles.playingTrack}>
            {/* <div className={styles.trackPlayer}>
            <div className={styles.time}>
              <div className={styles.currentTime}>
                {isSameTrack && calculateTime(playingTime)}
              </div>
              <div className={styles.duration}>
                {typeof headerTrackDuration === "number" &&
                  !isNaN(headerTrackDuration) &&
                  calculateTime(headerTrackDuration)}
              </div>
            </div>
            <div className={styles.barContainer}>
              <audio
                ref={headerPlayer}
                src={track.audio}
                preload="metadata"
                onLoadedMetadata={onLoadedMetadata}
              />
              <input
                ref={progressBar}
                type="range"
                className={styles.progressBar}
                defaultValue="0"
                onChange={audioSrc === track.audio ? changeRange : () => null}
                // onMouseDown={onPlayerClick}
                onInput={onPlayerClick}
                step="0.3"
                // onMouseDown={(event) => {
                //   event.preventDefault();
                // }}
                max={
                  audioSrc === track.audio && headerTrackDuration
                    ? trackDuration
                    : headerTrackDuration
                }
              />
            </div>
          </div> */}
          </div>
        )}

        {noSet || <SetTag playlist={playlist} />}
        {noSet || (
          <SetImage
            openModal={openModal}
            playlist={playlist}
            setHeader={setHeader}
          />
        )}
      </div>
    </div>
  );
};
export default SetHeader;
