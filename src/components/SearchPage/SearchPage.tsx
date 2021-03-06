import React from "react";
import axios from "axios";
import { throttle } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart } from "react-icons/ai";
import { BiPlay, BiRepost } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaCommentAlt } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useHistory } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useTrackContext } from "../../context/TrackContext";
import styles from "./SearchPage.module.scss";

interface ISearchTrack {
  artist: {
    permalink: string;
    display_name: string;
    id: number;
  };
  permalink: string;
  title: string;
  is_liked: boolean;
  is_reposted: boolean;
  repost_count: number;
  like_count: number;
  comment_count: number;
  play_count: number;
  audio: string;
  image: string;
  id: number;
  created_at: string;
  tags: string[];
  is_private: boolean;
  audio_length: number;
}

const SearchPage = () => {
  const [noParams, setNoParams] = useState<undefined | boolean>(undefined);
  const [searchResults, setSearchResults] = useState<ISearchTrack[]>([]);
  const [resultCount, setResultCount] = useState<number | undefined>(undefined);
  const [noResults, setNoResults] = useState(false);
  const [isFinalResult, setIsFinalResult] = useState(false);
  const [genre, setGenre] = useState<undefined | string>(undefined);
  //   const [searchedGenre, setSearchedGenre] = useState<undefined | string>(
  //     undefined
  //   );
  const nextPage = useRef(1);
  const finalPage = useRef(0);
  const { userSecret } = useAuthContext();
  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const item = params.get("text");
  const urlGenre = params.get("genres[]");

  const searchTracks = async (withGenre: boolean) => {
    if (item?.trim().length === 0 || item === null) {
      return;
    }
    if (genre && withGenre) {
      history.push(`/search?text=${item}&genres[]=${genre}`);
    }
    if (!withGenre) {
      setGenre("");
    }
    if (userSecret.jwt) {
      const search = throttle(async () => {
        const config: any = {
          method: "get",
          url: `/search/tracks?text=${item}&page=1&page_size=10`,
          headers: {
            Authorization: `JWT ${userSecret.jwt}`,
          },
          data: {},
          params: {
            ...(genre !== undefined &&
              genre.trim().length !== 0 &&
              withGenre && { genres: [genre] }),
          },
        };
        try {
          const { data } = await axios(config);
          if (data.count == 0) {
            setNoResults(true);
            setGenre(undefined);
          } else {
            setNoResults(false);
            setResultCount(data.count);
            setSearchResults(
              data.results.filter(
                (value: ISearchTrack, index: number, self: ISearchTrack[]) =>
                  index === self.findIndex((t) => t.id === value.id)
              )
            );
            if (data.next) {
              nextPage.current += 1;
            } else {
              finalPage.current = nextPage.current;
              setIsFinalResult(true);
            }
          }
        } catch (error) {
          console.log(error);
          toast.error("????????? ??????????????????");
        }
      }, 1000);
      search();
    }
  };

  const genreSearch: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // setSearchedGenre(genre);
    searchTracks(true);
  };

  const fetchNextTracks = async () => {
    if (nextPage.current !== finalPage.current) {
      const config: any = {
        method: "get",
        url: `/search/tracks?text=${item}&page=${nextPage.current}&page_size=10`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: {},
        params: {
          ...(genre !== undefined && { genres: [genre] }),
        },
      };
      try {
        const response = await axios(config);
        const data = response.data;
        setSearchResults(
          searchResults
            .concat(data.results)
            .filter(
              (value: ISearchTrack, index: number, self: ISearchTrack[]) =>
                index === self.findIndex((t) => t.id === value.id)
            )
        );
        if (data.next) {
          nextPage.current += 1;
        } else {
          finalPage.current = nextPage.current;
          setIsFinalResult(true);
        }
      } catch (error) {
        console.log(error);
        toast.error("?????? ????????? ????????? ??? ????????????");
      }
    }
  };

  useEffect(() => {
    if (item === null || item.trim().length <= 1) {
      setNoParams(true);
      setNoResults(true);
      toast.error("??? ?????? ????????? ???????????? ??????????????????");
    } else {
      setNoParams(false);
      //   searchTracks(false);
    }
    if (urlGenre) {
      setGenre(urlGenre);
      searchTracks(true);
    } else {
      setGenre(undefined);
      searchTracks(false);
    }
  }, [item, userSecret.jwt, urlGenre]);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight == scrollHeight) {
      // ????????? ?????? ???????????? ?????? ???????????? ????????????
      fetchNextTracks();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const onGenreChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setGenre(event.target.value);
  };

  return (
    <div className={styles.searchWrapper}>
      <div
        className={`${styles.search}  ${isFinalResult && styles.bottomBorder}`}
      >
        {noParams === true && (
          <div className={styles.noParams}>
            <div className={styles.center}>
              <div className={styles.searchSvg}>
                <BsSearch />
              </div>
              <div className={styles.phrase}>
                Search SoundWaffle for tracks.
              </div>
            </div>
          </div>
        )}
        {noResults === true && (
          <div className={styles.noParams}>
            <div className={styles.center}>
              <div className={styles.searchSvg}>
                <BsSearch />
              </div>
              <div className={styles.phrase}>
                Sorry we didn't find any results for "{item}". Check the
                spelling, or try a different search.
              </div>
            </div>
          </div>
        )}
        {noResults === false && (
          <>
            <div className={styles.header}>
              <div className={styles.resultsFor}>
                Search results for "{item}"
              </div>
              <form className={styles.setGenre} onSubmit={genreSearch}>
                <div className={styles.label}>Filter by genre:</div>
                <input value={genre} onChange={onGenreChange} />
                <button type="submit">Search!</button>
              </form>
            </div>
            <div className={styles.body}>
              <div className={styles.resultCount}>
                Found {resultCount} tracks
              </div>
              {searchResults.map((result) => {
                return <SearchItem searchTrack={result} key={result.id} />;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default SearchPage;

const SearchItem = ({ searchTrack }: { searchTrack: ISearchTrack }) => {
  const [heart, setHeart] = useState(false); // like ?????? state
  const [repost, setRepost] = useState(false); // repost ?????? state
  const [comment, setComment] = useState<string>(""); // comment input
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // track playing ??????
  const [headerTrackDuration, setHeaderTrackDuration] = useState<
    number | undefined
  >(undefined);
  const [isSameTrack, setIsSameTrack] = useState<boolean | undefined>(
    undefined
  );
  const [repostCount, setRepostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    setLikeCount(searchTrack.like_count);
    setRepostCount(searchTrack.repost_count);
  }, [searchTrack]);
  const { userSecret } = useAuthContext();
  const history = useHistory();
  const goTrack = () => {
    history.push(`/${searchTrack.artist.permalink}/${searchTrack.permalink}`); // trackPage??? ?????? ??????
  };
  const goArtist = () => {
    history.push(`/${searchTrack.artist.permalink}`); // artistPage??? ?????? ??????
  };
  const {
    trackDuration,
    trackIsPlaying,
    setTrackIsPlaying,
    playingTime,
    setPlayingTime,
    audioPlayer,
    audioSrc,
    setAudioSrc,
    setTrackBarArtist,
    setTrackBarTrack,
    trackBarTrack,
    setTrackBarPlaylist,
  } = useTrackContext();
  // presigned url??? ?????? ?????????????????? ???????????? ???????????? ???????????? ???????????? ??????
  const headerTrackSrc = searchTrack.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];

  //   const hitTrack = async (track_id: string | number) => {
  //     // hit track ??????
  //     await axios({
  //       method: "put",
  //       url: `tracks/${track_id}/hit`,
  //       headers: { Authorization: `JWT ${userSecret.jwt}` },
  //       data: {
  //         user_id: userSecret.id,
  //       },
  //     });
  //   };
  useEffect(() => {
    // ????????????
    if (barTrackSrc === headerTrackSrc) {
      setIsSameTrack(true);
    } else {
      setIsSameTrack(false);
    }
  }, [searchTrack]);
  useEffect(() => {
    // ????????????
    if (barTrackSrc === headerTrackSrc) {
      setHeaderTrackDuration(trackDuration);
    }
  }, [searchTrack, isSameTrack, trackDuration]);
  const progressBar = useRef<any>(null); // ?????? ??? ?????? ??????(input) // ????????????
  const animationRef = useRef(0); // ?????? ???????????????  // ????????????
  const calculateTime = (secs: number) => {
    // ?????? ????????????
    // ?????? ????????? ???:??? ????????? ??????
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };
  const changeRange = () => {
    // ????????????
    audioPlayer.current.currentTime = progressBar.current.value; // input slider??? ?????? ??????
    setPlayingTime(audioPlayer.current.currentTime);
    changePlayerCurrentTime();
  };
  const togglePlayPause = () => {
    // ??????/???????????? ?????? ?????? ???
    if (barTrackSrc === headerTrackSrc) {
      const prevValue = trackIsPlaying;
      setTrackIsPlaying(!prevValue);
      if (!prevValue) {
        // ????????? ????????? ???
        audioPlayer.current.play(); // ??????????????? ???????????? ????????? ?????? ??????(Track > Audio > AudioTag.tsx)
        setPlayingTime(audioPlayer.current.currentTime); // ????????? ????????? ?????? ????????? ??????????????? ??????
        animationRef.current = requestAnimationFrame(whilePlaying); // ????????????
      } else {
        // ???????????? ????????? ???
        audioPlayer.current.pause();
        setPlayingTime(audioPlayer.current.currentTime);
        cancelAnimationFrame(animationRef.current); // ????????????
      }
    } else {
      setAudioSrc(searchTrack.audio);
      setTrackIsPlaying(true);
      setTrackBarArtist({
        // ???????????? ??????
        display_name: searchTrack.artist.display_name,
        id: searchTrack.artist.id,
        permalink: searchTrack.artist.permalink,
      });
      setTrackBarTrack({
        // ?????? ??????
        id: searchTrack.id,
        title: searchTrack.title,
        permalink: searchTrack.permalink,
        audio: searchTrack.audio,
        image: searchTrack.image,
      });
      setIsSameTrack(true);
      audioPlayer.current.src = searchTrack.audio;
      setTrackBarPlaylist([]); // playlist ?????????
      //   hitTrack(searchTrack.id);
      setTimeout(() => {
        audioPlayer.current.play();
        setPlayingTime(audioPlayer.current.currentTime);
      }, 1);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };
  const whilePlaying = () => {
    if (searchTrack.id !== trackBarTrack.id) {
      // ?????? ??? ?????? ?????? ????????? ????????? ?????? ????????? ??????
      // progressBar.current.value = audioPlayer.current.currentTime;
      if (progressBar.current) {
        setPlayingTime(progressBar.current.value); // progressBar ?????? ???????????? ???????????? ?????? ??????
        changePlayerCurrentTime(); // ????????????
        animationRef.current = requestAnimationFrame(whilePlaying); // ????????????
      }
    }
  };

  const changePlayerCurrentTime = useCallback(
    // ????????????
    throttle(() => {
      if (
        progressBar.current &&
        audioPlayer.current &&
        searchTrack.id === trackBarTrack.id
      ) {
        progressBar.current.value = audioPlayer.current.currentTime;
        // ?????? ?????? ??????????????? ?????? ????????? ?????? ????????? ??????
        progressBar.current.style.setProperty(
          "--seek-before-width",
          `${(audioPlayer.current.currentTime / trackDuration) * 100}%`
        );
        setPlayingTime(audioPlayer.current.currentTime);
      } else if (progressBar.current) {
        setPlayingTime(0);
        progressBar.current.value = 0;
        progressBar.current.style.setProperty("--seek-before-width", `0%`);
      }
    }, 30000),
    [playingTime]
  );

  useEffect(() => {
    // ???????????? ?????????????????? ???????????? changePlayerCurrentTime?????? whilePlaying()??? ?????????????????? ????????? ????????? ???????????? ??? ??????????????????..
    changePlayerCurrentTime();
  }, [playingTime, audioSrc]);

  const onPlayerClick = () => {
    // ????????? ?????????????????? ???????????? ????????? ???????????? ??? ?????????????????? ????????? ?????? ????????? ???????????? ????????? ??????, ??? ??? ??????/?????? ?????? ????????? ??????????????? ???????????? ?????? ???????????????
    audioPlayer.current.pause();
    // ?????? ??? ??????????????? ????????? ???????????? ?????????????????? ??????????????? ???
    if (searchTrack.id !== trackBarTrack.id) {
      // ?????? ???????????? ?????? ????????? ?????? ??????
      setAudioSrc(searchTrack.audio);
      setIsSameTrack(true); // ????????????
      audioPlayer.current.src = searchTrack.audio;
      audioPlayer.current.load();
      //   audioPlayer.current.play();
      setTrackBarArtist({
        // ???????????? ??????
        display_name: searchTrack.artist.display_name,
        id: searchTrack.artist.id,
        permalink: searchTrack.artist.permalink,
      });
      setTrackBarTrack({
        // ?????? ??????
        id: searchTrack.id,
        title: searchTrack.title,
        permalink: searchTrack.permalink,
        audio: searchTrack.audio,
        image: searchTrack.image,
      });
    }
    // console.log("onclick");
    audioPlayer.current.currentTime = progressBar.current.value; // ????????? ????????? ????????? ????????????(?????? ???????????? audio ??????) ????????????
    setPlayingTime(progressBar.current.value); // ?????????????????? ?????????
    // console.log(progressBar.current.value);
    setTrackIsPlaying(true); // ??????????????? ?????? ????????? ???????????? ????????? ?????????????????????
    // audioPlayer.current.play();
    setTimeout(() => {
      audioPlayer.current.play();
    }, 10);
    animationRef.current = requestAnimationFrame(whilePlaying); // ????????????
  };
  const headerPlayer = useRef<HTMLAudioElement>(null); // ????????????
  const onLoadedMetadata = useCallback(() => {
    // ????????????
    setHeaderTrackDuration(headerPlayer.current?.duration);
  }, [audioSrc]);

  const handleHeart = async (e: any) => {
    // like ?????? ???, like ??? ?????? list track GET ?????? ??????
    e.stopPropagation();
    if (heart === false) {
      await axios({
        method: "post",
        url: `/likes/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("like??? ?????????????????????"));
      const config: any = {
        method: "get",
        url: `/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      };
      try {
        const { data } = await axios(config);
        setLikeCount(data.like_count);
        setHeart(!heart);
      } catch (error) {
        console.log(error);
      }
    } else {
      await axios({
        method: "delete",
        url: `/likes/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("like??? ?????????????????????"));
      const config: any = {
        method: "get",
        url: `/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      };
      try {
        const { data } = await axios(config);
        setLikeCount(data.like_count);
        setHeart(!heart);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const repostTrack = async (e: any) => {
    // repost ?????? ?????? ???, repost ??? ?????? list track GET ?????? ??????
    e.stopPropagation();
    if (repost === false) {
      await axios({
        method: "post",
        url: `/reposts/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("repost??? ?????????????????????"));
      const config: any = {
        method: "get",
        url: `/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      };
      try {
        const { data } = await axios(config);
        setRepostCount(data.repost_count);
        setRepost(!repost);
      } catch (error) {
        console.log(error);
      }
    } else {
      await axios({
        method: "delete",
        url: `/reposts/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("repost??? ?????????????????????"));
      const config: any = {
        method: "get",
        url: `/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      };
      try {
        const { data } = await axios(config);
        setRepostCount(data.repost_count);
        setRepost(!repost);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const postComment = (e: any) => {
    // comment post?????? ??????
    if (e.key === "Enter") {
      axios
        .post(
          `/tracks/${searchTrack.id}/comments`,
          {
            content: comment,
          },
          {
            headers: {
              Authorization: `JWT ${userSecret.jwt}`,
            },
          }
        )
        .then(() => {
          toast("?????? ?????? ??????");
          setComment("");
        })
        .catch(() => {
          toast("?????? ?????? ??????");
        });
    }
  };
  const handlePlay = (e: any) => {
    // playButton handle ?????? ??????
    e.stopPropagation();
    togglePlayPause();
    trackBarTrack.id === searchTrack.id
      ? setIsPlaying(!trackIsPlaying)
      : setIsPlaying(true);
  };
  useEffect(() => {
    // like, repost ?????? ???????????? useEffect
    setHeart(searchTrack.is_liked);
    setRepost(searchTrack.is_reposted);
  }, [searchTrack]);
  useEffect(() => {
    // url ???????????? trackBar playing ?????? ?????? ?????? uesEffect
    trackBarTrack.id === searchTrack.id ? null : setIsPlaying(false);
  }, [trackBarTrack, audioSrc]);
  const moveWeb = async () => {
    setIsPlaying(trackIsPlaying);
  };
  const playMusic = () => {
    // moveWeb?????? ??????
    if (trackIsPlaying) {
      audioPlayer.current.play();
      setPlayingTime(audioPlayer.current.currentTime);
    } else {
      audioPlayer.current.pause();
      setPlayingTime(audioPlayer.current.currentTime);
    }
  };
  useEffect(() => {
    // web ????????? trackBar play?????? ???????????? ??????
    trackBarTrack.id === searchTrack.id
      ? moveWeb().then(() => playMusic())
      : null;
  }, [searchTrack]);
  useEffect(() => {
    trackBarTrack.id === searchTrack.id ? setIsPlaying(trackIsPlaying) : null;
  }, [trackIsPlaying, audioSrc]);

  const { userInfo } = useAuthContext();

  return (
    <div className={styles.wrapper}>
      <div className={styles.imgWrapper} onClick={goTrack}>
        {searchTrack.image === null ? (
          <svg
            className={styles.img}
            width="150"
            height="150"
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="155.294"
              y="155.294"
              width="64.7059"
              height="64.7059"
              fill="#ED8573"
            />
            <rect
              x="64.7059"
              y="155.294"
              width="64.7059"
              height="64.7059"
              fill="#F0975E"
            />
            <rect
              x="155.294"
              y="64.7059"
              width="64.7059"
              height="64.7059"
              fill="#F0975E"
            />
            <rect
              x="64.7059"
              y="64.7059"
              width="64.7059"
              height="64.7059"
              fill="#F0975E"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M64.7059 0H38.8236V38.8235H0V64.7059H38.8236V129.412H0V155.294H38.8236V220H64.7059V155.294H129.412V220H155.294V155.294H220V129.412H155.294V64.7059H220V38.8235H155.294V0H129.412V38.8235H64.7059V0ZM129.412 129.412V64.7059H64.7059V129.412H129.412Z"
              fill="#27181D"
            />
          </svg>
        ) : (
          <img src={searchTrack.image} alt="track img" className={styles.img} />
        )}
      </div>
      <div className={styles.rightSector}>
        <div className={styles.playAndInfo}>
          {isPlaying ? (
            <IoMdPause className={styles.playButton} onClick={handlePlay} />
          ) : (
            <IoMdPlay className={styles.playButton} onClick={handlePlay} />
          )}
          <div className={styles.info}>
            <div className={styles.artistName} onClick={goArtist}>
              {searchTrack.artist.display_name}
            </div>
            <div className={styles.trackTitle} onClick={goTrack}>
              {searchTrack.title}
            </div>
          </div>
        </div>
        <div className={styles.trackPlayer}>
          <div className={styles.time}>
            <div className={styles.currentTime}>
              {searchTrack.id === trackBarTrack.id &&
                calculateTime(playingTime)}
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
              src={searchTrack.audio}
              preload="metadata"
              onLoadedMetadata={onLoadedMetadata}
            />
            <input
              ref={progressBar}
              type="range"
              className={styles.progressBar}
              defaultValue="0"
              onChange={
                audioSrc === searchTrack.audio ? changeRange : () => null
              }
              // onMouseDown={onPlayerClick}
              onInput={onPlayerClick}
              step="0.3"
              // onMouseDown={(event) => {
              //   event.preventDefault();
              // }}
              max={
                audioSrc === searchTrack.audio && headerTrackDuration
                  ? trackDuration
                  : headerTrackDuration
              }
            />
          </div>
        </div>
        <div className={styles.commentWrapper}>
          {userInfo.profile_img === null ? (
            <img
              src="https://avatars.slack-edge.com/2021-11-21/2752177994355_754017ae7a70bee45092_192.png"
              alt="user img"
              className={styles.userImg}
            />
          ) : (
            <img
              src={userInfo.profile_img}
              alt="user img"
              className={styles.userImg}
            />
          )}
          <input
            type="text"
            placeholder={"Write a comment and Press Enter"}
            className={styles.commentInput}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={postComment}
          />
        </div>
        <div className={styles.details}>
          <div className={styles.likeAndRepost}>
            <div
              className={heart ? styles.likedHeartBox : styles.likeHeartBox}
              onClick={handleHeart}
            >
              <AiFillHeart className={heart ? styles.liked : styles.like} />
              {likeCount}
            </div>
            <div
              className={repost ? styles.repostedBox : styles.repostBox}
              onClick={repostTrack}
            >
              <BiRepost className={repost ? styles.reposted : styles.repost} />
              {repostCount}
            </div>
          </div>
          <div className={styles.playAndComment}>
            <div className={styles.playBox}>
              <BiPlay className={styles.play_count} />
              {searchTrack.play_count}
            </div>
            <div className={styles.commentBox}>
              <FaCommentAlt className={styles.comment_count} />
              &nbsp;{searchTrack.comment_count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
