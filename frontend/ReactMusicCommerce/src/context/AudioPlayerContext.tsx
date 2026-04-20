import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import type { AudioTrackModel } from "../models/AudioTrackModel";

interface AudioPlayerContextType {
  currentTrack: AudioTrackModel | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Hành động
  play: (track: AudioTrackModel) => void;
  pause: () => void;
  resume: () => void;
  togglePlayPause: (track?: AudioTrackModel) => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrackModel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);

  // Cập nhật thời gian phát
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const play = (track: AudioTrackModel) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Nếu là bài hát khác, tải source mới
    if (!currentTrack || currentTrack.id !== track.id) {
      setCurrentTrack(track);
      audio.src = track.watermarkedFileUrl || "";
      audio.load();
    }

    audio.play().catch((err) => {
      console.error("Lỗi phát nhạc:", err);
    });
    setIsPlaying(true);
  };

  const pause = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((err) => {
        console.error("Lỗi phát nhạc:", err);
      });
      setIsPlaying(true);
    }
  };

  const togglePlayPause = (track?: AudioTrackModel) => {
    if (track) {
      if (currentTrack?.id === track.id && isPlaying) {
        pause();
      } else if (currentTrack?.id === track.id && !isPlaying) {
        resume();
      } else {
        play(track);
      }
    } else {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
    }
  };

  const setVolume = (vol: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = vol;
      setVolumeState(vol);
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack(null);
      setCurrentTime(0);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        play,
        pause,
        resume,
        togglePlayPause,
        seek,
        setVolume,
        stop,
      }}
    >
      {children}
      {/* Hidden audio element */}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer phải được sử dụng trong AudioPlayerProvider");
  }
  return context;
};
