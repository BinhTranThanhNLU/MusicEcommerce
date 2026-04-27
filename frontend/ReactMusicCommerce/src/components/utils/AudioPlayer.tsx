import React from "react";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import "../../assets/css/audioPlayer.css";

const AudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    seek,
    setVolume,
    stop,
  } = useAudioPlayer();

  const previousVolumeRef = React.useRef(0.7);

  if (!currentTrack) {
    return null;
  }

  // Format thời gian (giây -> mm:ss)
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Xử lý thanh trượt thời gian
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  // Xử lý âm lượng
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = parseFloat(e.target.value);
    setVolume(nextVolume);

    if (nextVolume > 0) {
      previousVolumeRef.current = nextVolume;
    }
  };

  const handleToggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolumeRef.current || 0.7);
      return;
    }

    previousVolumeRef.current = volume;
    setVolume(0);
  };

  const progressPercent =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const volumePercent = Math.round(volume * 100);
  const genrePreview = currentTrack.tags?.genres?.slice(0, 2).join(" • ");

  return (
    <div className="audio-player fixed-bottom" role="region" aria-label="Audio player">
      <div className="audio-player__inner container-fluid">
        <div className="audio-player__left">
          <img
            src={currentTrack.coverImage}
            alt={currentTrack.title}
            className="audio-player__cover"
          />

          <div className="audio-player__meta">
            <p className="audio-player__title" title={currentTrack.title}>
              {currentTrack.title}
            </p>
            <p className="audio-player__artist" title={currentTrack.artist?.name}>
              {currentTrack.artist?.name}
            </p>
            <div className="audio-player__chips">
              <span className="audio-player__chip">
                <i className={`bi ${isPlaying ? "bi-broadcast" : "bi-pause-circle"}`}></i>
                {isPlaying ? "Now Playing" : "Paused"}
              </span>
              {genrePreview && <span className="audio-player__chip">{genrePreview}</span>}
            </div>
          </div>
        </div>

        <div className="audio-player__center">
          <div className="audio-player__controls">
            <button
              className="audio-player__control audio-player__control--primary"
              onClick={() => (isPlaying ? pause() : resume())}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>
            </button>

            <button
              className="audio-player__control"
              onClick={stop}
              aria-label="Stop"
            >
              <i className="bi bi-stop-fill"></i>
            </button>
          </div>

          <div className="audio-player__progress-wrap">
            <span className="audio-player__time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="audio-player__range"
              aria-label="Seek"
            />
            <span className="audio-player__time">{formatTime(duration)}</span>
          </div>

          <div className="audio-player__progress-info">Đã nghe: {Math.round(progressPercent)}%</div>
        </div>

        <div className="audio-player__right">
          <button
            className="audio-player__control"
            onClick={handleToggleMute}
            aria-label={volume === 0 ? "Unmute" : "Mute"}
          >
            <i
              className={`bi ${
                volume === 0
                  ? "bi-volume-mute-fill"
                  : volume < 0.5
                    ? "bi-volume-down-fill"
                    : "bi-volume-up-fill"
              }`}
            ></i>
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-player__range audio-player__range--volume"
            aria-label="Volume"
          />
          <span className="audio-player__volume-text">{volumePercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
