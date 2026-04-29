import React from "react";
import type { GenreModel } from "../../models/GenreModel";
import type { MoodModel } from "../../models/MoodModel";
import type { ThemeModel } from "../../models/ThemeModel";

interface Props {
  genres: GenreModel[];
  moods: MoodModel[];
  themes: ThemeModel[];
  selectedGenres: number[];
  selectedMoods: number[];
  selectedThemes: number[];
  toggleGenre: (id: number) => void;
  toggleMood: (id: number) => void;
  toggleTheme: (id: number) => void;
  errors: { [key: string]: string };
}

const SmartMetadata: React.FC<Props> = ({
  genres,
  moods,
  themes,
  selectedGenres,
  selectedMoods,
  selectedThemes,
  toggleGenre,
  toggleMood,
  toggleTheme,
  errors,
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Phân loại & Tìm kiếm thông minh</h5>
          <span className="badge bg-info bg-opacity-10 text-info rounded-pill">
            <i className="bi bi-robot"></i> Smart Metadata
          </span>
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium">
            Thể loại (Genre) <span className="text-danger">*</span>
          </label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`btn btn-sm rounded-pill ${selectedGenres.includes(genre.id) ? "btn-primary" : "btn-outline-secondary"}`}
              >
                <i className="bi bi-check me-1"></i> {genre.name}
              </button>
            ))}
          </div>
          {errors.genres && (
            <div className="alert alert-danger small mt-2 mb-0">
              <i className="bi bi-exclamation-circle me-1"></i>
              {errors.genres}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium">
            Tâm trạng (Mood) <span className="text-danger">*</span>
          </label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {moods.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => toggleMood(mood.id)}
                className={`btn btn-sm rounded-pill ${selectedMoods.includes(mood.id) ? "btn-primary" : "btn-outline-secondary"}`}
              >
                <i className="bi bi-check me-1"></i> {mood.name}
              </button>
            ))}
          </div>
          {errors.moods && (
            <div className="alert alert-danger small mt-2 mb-0">
              <i className="bi bi-exclamation-circle me-1"></i>
              {errors.moods}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium">Chủ đề (Theme)</label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => toggleTheme(theme.id)}
                className={`btn btn-sm rounded-pill ${selectedThemes.includes(theme.id) ? "btn-primary" : "btn-outline-secondary"}`}
              >
                <i className="bi bi-check me-1"></i> {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMetadata;
