import {useRef, useState, useEffect} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay as play, faPause as pause, faAngleLeft as left, faAngleRight as right, faVolumeUp as sound, faVolumeMute as mute, faRandom as random, faRedo as redo} from '@fortawesome/free-solid-svg-icons';


function Player({currentSong, setCurrentSong, songs, isPlaying, setIsPlaying}) {
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0
  });

  const [volume, setVolume] = useState(0.2);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [prevVolumeValue, setPrevVolumeValue] = useState(volume);
  const [skipBackwardFade, setSkipBackwardFade] = useState(false);
  const [skipForwardFade, setSkipForwardFade] = useState(false);

  const audioRef = useRef(null);

  // Fade skip icon when necessary
  useEffect(() => {
    let index = songs.findIndex((s) => s.id === currentSong.id);
    if (index === 0) {
      setSkipBackwardFade(true);
    } else {
      setSkipBackwardFade(false);
    }
    if (index === songs.length - 1) {
      setSkipForwardFade(true);
    } else {
      setSkipForwardFade(false);
    }
  }, [currentSong, songs]);


  // Change volume of song on each change
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume])

  // Listen for events to control audio
  useEffect(() => {
    document.addEventListener('keydown', e => {
      if (e.code === "Space") {
        handlePlay();
      } else if (e.code === "ArrowLeft") {
        handleSkipBack();
      } else if (e.code === "ArrowRight") {
        handleSkipForward();
      }
    })
  });


  // Event handlers

  const handlePlay = () => {
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);

    // Set volume
    audioRef.current.volume = volume;
  }

  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    // Update song info state
    setSongInfo({...songInfo, currentTime, duration});
  }

  const handleAutoPlay = () => {
    if (isPlaying) {
      audioRef.current.play();
    }
  }

  const handleDrag = (e) => {
    audioRef.current.currentTime = e.target.value;
    // setSongInfo({...songInfo, currentTime: e.target.value});
  }

  const handleSkipBack = () => {
    let index = songs.findIndex((s) => s.id === currentSong.id);
    if (index > 0) {
      setCurrentSong(songs[index - 1]);
    }
  }

  const handleSkipForward = () => {
    let index = songs.findIndex((s) => s.id === currentSong.id);
    if (index < songs.length - 1) {
      setCurrentSong(songs[index + 1]);
    }
  }

  const handleShuffle = () => {
    if (!shuffle && repeat) {
      setRepeat(false);
    }

    setShuffle(!shuffle);
  }

  const handleRepeat = () => {
    if (!repeat && shuffle) {
      setShuffle(false);
    }

    setRepeat(!repeat);
  }

  const handleEndOfSong = () => {
    let index = songs.findIndex((s) => s.id === currentSong.id);
    if (shuffle) {
      let randomNum = Math.floor(Math.random() * (songs.length));
      setCurrentSong(songs[randomNum]);
      return;
    }
    if (repeat) {
      setCurrentSong(currentSong);
      audioRef.current.play();
      return;
    } 
    if (index < songs.length - 1) {
      setCurrentSong(songs[index + 1]);
    }
  }

  const handleVolume = (e) => {
    setVolume(e.target.value);
    setIsMuted(false);
  }

  const handleMute = () => {
    if (isMuted) {
      setVolume(prevVolumeValue);
      setIsMuted(false);
    } else {
      setPrevVolumeValue(volume);
      setVolume(0);
      setIsMuted(true);
    }
  }


  // Functions

  const convertTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }


  // Style objects
  
  const trackAnimStyle = {
    transform: `translateX(${(songInfo.currentTime / songInfo.duration) * 100}%)`
  }

  const trackBgStyle = {
    background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`
  }

  const volumeAnimStyle = {
    transform: `translateX(${volume * 100}%)`
  }

  const volumeBgStyle = {
    background: `linear-gradient(to left, ${currentSong.color[0]}, ${currentSong.color[1]})`
  }


  return (
    <div className="player">
      <div className="time-control">
        <p>{convertTime(songInfo.currentTime)}</p>
        <div className="track" style={trackBgStyle}>
          <input
            type="range"
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={handleDrag}
          />
          <div className="animate-track" style={trackAnimStyle}></div>
        </div>
        <p>{convertTime(songInfo.duration || 0)}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={handleShuffle}
          className={`shuffle-icon ${shuffle ? 'active' : ''}`}
          icon={random}
          size="1x"
        />
        <FontAwesomeIcon
          onClick={handleSkipBack}
          className={`skip-back ${skipBackwardFade ? "skip-faded" : ""}`}
          icon={left}
          size="2x"
        />
        <FontAwesomeIcon
          onClick={handlePlay}
          className="play"
          icon={isPlaying ? pause : play}
          size="2x"
        />
        <FontAwesomeIcon
          onClick={handleSkipForward}
          className={`skip-forward ${skipForwardFade ? "skip-faded" : ""}`}
          icon={right}
          size="2x"
        />
        <FontAwesomeIcon
          onClick={handleRepeat}
          className={`shuffle-icon ${repeat ? 'active' : ''}`}
          icon={redo}
          size="1x"
        />
      </div>
      <div className="volume-control">
        <div className="volume-wrapper"  style={volumeBgStyle}>
          <input
          type="range"
          onChange={handleVolume}
          value={volume}
          min="0"
          max="1"
          step="0.001"
          className="volume-slider"
          />
          <div className="volume-track" style={volumeAnimStyle}></div>
        </div>
        <div className="icon-div">
          <FontAwesomeIcon className="mute-btn" icon={isMuted ? mute : sound} onClick={handleMute} />
        </div>
      </div>
      <audio
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleAutoPlay}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEndOfSong}
        ref={audioRef}
        src={currentSong.audio}
      ></audio>
    </div>
  );
}


export default Player;