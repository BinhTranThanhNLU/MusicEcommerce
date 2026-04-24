import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import type { AudioTrackModel } from "../models/AudioTrackModel";
import { incrementPreviewPlayCount } from "../apis/audioTrackApi";

interface AudioPlayerContextType {
  currentTrack: AudioTrackModel | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  getDisplayPlayCount: (audioId: number, fallbackPlayCount?: number) => number;
  
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
  const [playCountMap, setPlayCountMap] = useState<Record<number, number>>({});

  const getDisplayPlayCount = (audioId: number, fallbackPlayCount = 0) => {
    const mappedValue = playCountMap[audioId];
    if (typeof mappedValue === "number") {
      return mappedValue;
    }

    if (currentTrack?.id === audioId) {
      return currentTrack.playCount ?? fallbackPlayCount;
    }

    return fallbackPlayCount;
  };

  const syncPreviewPlayCount = (audioId: number) => {
    void incrementPreviewPlayCount(audioId)
      .then((response) => {
        setPlayCountMap((prev) => ({
          ...prev,
          [response.audioId]: response.playCount,
        }));

        setCurrentTrack((prev) => {
          if (!prev || prev.id !== response.audioId) return prev;
          return {
            ...prev,
            playCount: response.playCount,
          };
        });
      })
      .catch((err) => {
        console.error("Lỗi tăng lượt nghe preview:", err);
      });
  };

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
      setPlayCountMap((prev) => {
        if (typeof prev[track.id] === "number") {
          return prev;
        }

        return {
          ...prev,
          [track.id]: track.playCount ?? 0,
        };
      });
      audio.src = track.watermarkedFileUrl || "";
      audio.load();

      syncPreviewPlayCount(track.id);
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
        syncPreviewPlayCount(track.id);
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
        getDisplayPlayCount,
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
