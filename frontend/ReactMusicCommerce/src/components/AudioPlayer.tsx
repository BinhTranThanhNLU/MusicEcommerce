import React from "react";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import "../assets/css/audioPlayer.css";

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
  } = useAudioPlayer();

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
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="audio-player fixed-bottom bg-dark text-white p-3 shadow-lg">
      <div className="container-fluid">
        <div className="row align-items-center g-3">
          {/* Thông tin bài hát */}
          <div className="col-md-3 d-flex align-items-center gap-2">
            <img
              src={currentTrack.coverImage}
              alt={currentTrack.title}
              className="rounded"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div className="text-truncate">
              <div className="small text-truncate fw-bold">
                {currentTrack.title}
              </div>
              <div className="text-muted small text-truncate">
                {currentTrack.artist?.name}
              </div>
            </div>
          </div>

          {/* Controls & Progress */}
          <div className="col-md-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              {/* Play/Pause Button */}
              <button
                className="btn btn-sm btn-primary rounded-circle d-flex align-items-center justify-content-center"
                onClick={() => (isPlaying ? pause() : resume())}
                style={{ width: "40px", height: "40px" }}
              >
                <i
                  className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
                ></i>
              </button>

              {/* Thời gian hiện tại */}
              <small className="text-muted" style={{ minWidth: "45px" }}>
                {formatTime(currentTime)}
              </small>

              {/* Progress Bar */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="form-range flex-grow-1"
                style={{ height: "5px" }}
              />

              {/* Thời gian tổng */}
              <small className="text-muted" style={{ minWidth: "45px" }}>
                {formatTime(duration)}
              </small>
            </div>
          </div>

          {/* Volume Control */}
          <div className="col-md-3 d-flex align-items-center justify-content-end gap-2">
            <i className="bi bi-volume-down text-muted"></i>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="form-range"
              style={{ width: "100px", height: "5px" }}
            />
            <i className="bi bi-volume-up text-muted"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
