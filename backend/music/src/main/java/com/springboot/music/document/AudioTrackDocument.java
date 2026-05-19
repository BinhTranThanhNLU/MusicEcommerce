package com.springboot.music.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.time.LocalDateTime;
import java.util.List;

@Document(indexName = "audio_tracks_index")
@Setting(settingPath = "es-settings.json")
public class AudioTrackDocument {

    @Id
    @Field(type = FieldType.Keyword)
    private String id;

    @Field(type = FieldType.Text, analyzer = "vietnamese")
    private String title;

    @Field(type = FieldType.Text, analyzer = "vietnamese")
    private String artistName;

    @Field(type = FieldType.Keyword)
    private String audioType; // Short-audio, Instrumental, Full-song

    @Field(type = FieldType.Text, analyzer = "vietnamese")
    private String description; // Hỗ trợ Semantic Search

    @Field(type = FieldType.Text, analyzer = "vietnamese")
    private String lyrics;

    @Field(type = FieldType.Keyword)
    private String status; // Pending, Approved, Rejected

    @Field(type = FieldType.Keyword)
    private List<String> genres;

    @Field(type = FieldType.Keyword)
    private List<String> moods;

    @Field(type = FieldType.Keyword)
    private List<String> themes;

    @Field(type = FieldType.Long)
    private List<Long> pricesVnd;

    @Field(type = FieldType.Integer)
    private Integer playCount;

    @Field(type = FieldType.Keyword, index = false)
    private String coverImage;

    @Field(type = FieldType.Date, format = {}, pattern = "uuuu-MM-dd'T'HH:mm:ss||epoch_millis")
    private LocalDateTime uploadDate;

    public AudioTrackDocument() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getAudioType() {
        return audioType;
    }

    public void setAudioType(String audioType) {
        this.audioType = audioType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLyrics() {
        return lyrics;
    }

    public void setLyrics(String lyrics) {
        this.lyrics = lyrics;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public List<String> getMoods() {
        return moods;
    }

    public void setMoods(List<String> moods) {
        this.moods = moods;
    }

    public List<String> getThemes() {
        return themes;
    }

    public void setThemes(List<String> themes) {
        this.themes = themes;
    }

    public List<Long> getPricesVnd() {
        return pricesVnd;
    }

    public void setPricesVnd(List<Long> pricesVnd) {
        this.pricesVnd = pricesVnd;
    }

    public Integer getPlayCount() {
        return playCount;
    }

    public void setPlayCount(Integer playCount) {
        this.playCount = playCount;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
}