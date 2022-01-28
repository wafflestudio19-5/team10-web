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
  const nextPage = useRef(1);
  const finalPage = useRef(0);
  const { userSecret } = useAuthContext();
  const params = new URLSearchParams(window.location.search);
  const item = params.get("text");

  const searchTracks = async () => {
    if (userSecret.jwt) {
      const config: any = {
        method: "get",
        url: `/search/tracks?text=${item}&page=1&page_size=10`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: { genres: [genre] },
      };
      console.log(config);
      try {
        const { data } = await axios(config);
        if (data.count == 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
          setResultCount(data.count);
          setSearchResults(data.results);
          if (data.next) {
            nextPage.current += 1;
          } else {
            finalPage.current = nextPage.current;
            setIsFinalResult(true);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("검색에 실패했습니다");
      }
    }
  };

  const genreSearch: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    searchTracks();
  };

  const fetchNextTracks = async () => {
    if (nextPage.current !== finalPage.current) {
      const config: any = {
        method: "get",
        url: `/search/tracks?text=${item}&page=${nextPage.current}&page_size=10`,
        headers: {
          Authorization: `JWT ${userSecret.jwt}`,
        },
        data: { ...(genre !== undefined && { genres: [genre] }) },
      };
      try {
        const response = await axios(config);
        const data = response.data;
        setSearchResults(searchResults.concat(data.results));
        if (data.next) {
          nextPage.current += 1;
        } else {
          finalPage.current = nextPage.current;
          setIsFinalResult(true);
        }
      } catch (error) {
        console.log(error);
        toast.error("검색 정보를 불러올 수 없습니다");
      }
    }
  };

  useEffect(() => {
    if (item === null) {
      setNoParams(true);
    } else {
      setNoParams(false);
      searchTracks();
    }
  }, [item, userSecret.jwt]);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
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
  const [heart, setHeart] = useState(false); // like 유무 state
  const [repost, setRepost] = useState(false); // repost 유무 state
  const [comment, setComment] = useState<string>(""); // comment input
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // track playing 유무
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
    history.push(`/${searchTrack.artist.permalink}/${searchTrack.permalink}`); // trackPage로 가는 함수
  };
  const goArtist = () => {
    history.push(`/${searchTrack.artist.permalink}`); // artistPage로 가는 함수
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
  // presigned url이 같은 트랙이더라도 뒷부분이 달라져서 앞부분만 비교하기 위함
  const headerTrackSrc = searchTrack.audio.split("?")[0];
  const barTrackSrc = audioSrc.split("?")[0];

  //   const hitTrack = async (track_id: string | number) => {
  //     // hit track 함수
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
    // 필요없음
    if (barTrackSrc === headerTrackSrc) {
      setIsSameTrack(true);
    } else {
      setIsSameTrack(false);
    }
  }, [searchTrack]);
  useEffect(() => {
    // 필요없음
    if (barTrackSrc === headerTrackSrc) {
      setHeaderTrackDuration(trackDuration);
    }
  }, [searchTrack, isSameTrack, trackDuration]);
  const progressBar = useRef<any>(null); // 재생 바 태그 접근(input) // 필요없음
  const animationRef = useRef(0); // 재생 애니메이션  // 필요없음
  const calculateTime = (secs: number) => {
    // 아마 필요없음
    // 트랙 길이를 분:초 단위로 환산
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };
  const changeRange = () => {
    // 필요없음
    audioPlayer.current.currentTime = progressBar.current.value; // input slider와 트랙 연결
    setPlayingTime(audioPlayer.current.currentTime);
    changePlayerCurrentTime();
  };
  const togglePlayPause = () => {
    // 재생/일시정지 버튼 누를 때
    if (barTrackSrc === headerTrackSrc) {
      const prevValue = trackIsPlaying;
      setTrackIsPlaying(!prevValue);
      if (!prevValue) {
        // 재생을 눌렀을 때
        audioPlayer.current.play(); // 콘텍스트에 담아놓은 오디오 파일 재생(Track > Audio > AudioTag.tsx)
        setPlayingTime(audioPlayer.current.currentTime); // 오디오 파일의 현재 시간을 콘텍스트에 담음
        animationRef.current = requestAnimationFrame(whilePlaying); // 필요없음
      } else {
        // 일시정지 눌렀을 때
        audioPlayer.current.pause();
        setPlayingTime(audioPlayer.current.currentTime);
        cancelAnimationFrame(animationRef.current); // 필요없음
      }
    } else {
      setAudioSrc(searchTrack.audio);
      setTrackIsPlaying(true);
      setTrackBarArtist({
        // 아티스트 정보
        display_name: searchTrack.artist.display_name,
        id: searchTrack.artist.id,
        permalink: searchTrack.artist.permalink,
      });
      setTrackBarTrack({
        // 트랙 정보
        id: searchTrack.id,
        title: searchTrack.title,
        permalink: searchTrack.permalink,
        audio: searchTrack.audio,
        image: searchTrack.image,
      });
      setIsSameTrack(true);
      audioPlayer.current.src = searchTrack.audio;
      setTrackBarPlaylist([]); // playlist 초기화
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
      // 재생 중 트랙 바와 페이지 트랙과 싱크 맞추기 위함
      // progressBar.current.value = audioPlayer.current.currentTime;
      if (progressBar.current) {
        setPlayingTime(progressBar.current.value); // progressBar 대신 사용하는 플레이어 시간 넣기
        changePlayerCurrentTime(); // 필요없음
        animationRef.current = requestAnimationFrame(whilePlaying); // 필요없음
      }
    }
  };

  const changePlayerCurrentTime = useCallback(
    // 필요없음
    throttle(() => {
      if (
        progressBar.current &&
        audioPlayer.current &&
        searchTrack.id === trackBarTrack.id
      ) {
        progressBar.current.value = audioPlayer.current.currentTime;
        // 재생 바에 슬라이더가 있는 곳까지 색을 바꾸기 위함
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
    // 제생각엔 라이브러리를 사용하면 changePlayerCurrentTime대신 whilePlaying()을 사용해야될거 같은데 실제로 안해봐서 잘 모르겠습니다..
    changePlayerCurrentTime();
  }, [playingTime, audioSrc]);

  const onPlayerClick = () => {
    // 이것도 라이브러리를 사용하면 어떻게 되는건지 잘 모르겠네요ㅠ 재생바 아무 위치나 클릭하면 재생이 되고, 또 그 시간/트랙 정보 등등이 콘텍스트에 담기도록 하기 위함입니다
    audioPlayer.current.pause();
    // 재생 바 아무곳이나 누르면 일시정지 상태였더라도 재생되도록 함
    if (searchTrack.id !== trackBarTrack.id) {
      // 이미 재생하고 있던 트랙이 아닌 경우
      setAudioSrc(searchTrack.audio);
      setIsSameTrack(true); // 필요없음
      audioPlayer.current.src = searchTrack.audio;
      audioPlayer.current.load();
      //   audioPlayer.current.play();
      setTrackBarArtist({
        // 아티스트 정보
        display_name: searchTrack.artist.display_name,
        id: searchTrack.artist.id,
        permalink: searchTrack.artist.permalink,
      });
      setTrackBarTrack({
        // 트랙 정보
        id: searchTrack.id,
        title: searchTrack.title,
        permalink: searchTrack.permalink,
        audio: searchTrack.audio,
        image: searchTrack.image,
      });
    }
    // console.log("onclick");
    audioPlayer.current.currentTime = progressBar.current.value; // 클릭한 시간을 오디오 플레이어(실제 재생되는 audio 태그) 시간으로
    setPlayingTime(progressBar.current.value); // 콘텍스트에도 담아줌
    // console.log(progressBar.current.value);
    setTrackIsPlaying(true); // 사클에서는 트랙 재생바 클릭하면 무조건 재생되더라고용
    // audioPlayer.current.play();
    setTimeout(() => {
      audioPlayer.current.play();
    }, 10);
    animationRef.current = requestAnimationFrame(whilePlaying); // 필요없음
  };
  const headerPlayer = useRef<HTMLAudioElement>(null); // 필요없음
  const onLoadedMetadata = useCallback(() => {
    // 필요없음
    setHeaderTrackDuration(headerPlayer.current?.duration);
  }, [audioSrc]);

  const handleHeart = async (e: any) => {
    // like 함수 및, like 후 해당 list track GET 하는 함수
    e.stopPropagation();
    if (heart === false) {
      await axios({
        method: "post",
        url: `/likes/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("like에 실패하였습니다"));
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
      }).catch(() => toast.error("like에 실패하였습니다"));
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
    // repost 하는 함수 및, repost 후 해당 list track GET 하는 함수
    e.stopPropagation();
    if (repost === false) {
      await axios({
        method: "post",
        url: `/reposts/tracks/${searchTrack.id}`,
        headers: { Authorization: `JWT ${userSecret.jwt}` },
      }).catch(() => toast.error("repost에 실패하였습니다"));
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
      }).catch(() => toast.error("repost에 실패하였습니다"));
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
    // comment post하는 함수
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
          toast("댓글 작성 완료");
          setComment("");
        })
        .catch(() => {
          toast("댓글 작성 실패");
        });
    }
  };
  const handlePlay = (e: any) => {
    // playButton handle 하는 함수
    e.stopPropagation();
    togglePlayPause();
    trackBarTrack.id === searchTrack.id
      ? setIsPlaying(!trackIsPlaying)
      : setIsPlaying(true);
  };
  useEffect(() => {
    // like, repost 유무 체크하는 useEffect
    setHeart(searchTrack.is_liked);
    setRepost(searchTrack.is_reposted);
  }, [searchTrack]);
  useEffect(() => {
    // url 이동할때 trackBar playing 유무 체크 하는 uesEffect
    trackBarTrack.id === searchTrack.id ? null : setIsPlaying(false);
  }, [trackBarTrack, audioSrc]);
  const moveWeb = async () => {
    setIsPlaying(trackIsPlaying);
  };
  const playMusic = () => {
    // moveWeb관련 함수
    if (trackIsPlaying) {
      audioPlayer.current.play();
      setPlayingTime(audioPlayer.current.currentTime);
    } else {
      audioPlayer.current.pause();
      setPlayingTime(audioPlayer.current.currentTime);
    }
  };
  useEffect(() => {
    // web 이동시 trackBar play상태 가져오는 함수
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
