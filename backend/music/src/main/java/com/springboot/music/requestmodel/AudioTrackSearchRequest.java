package com.springboot.music.requestmodel;

import java.util.List;

/**
 * Request model cho tìm kiếm advanced
 */
public class AudioTrackSearchRequest {

    private String keyword;
    private String searchType; // "full-text", "fuzzy", "phrase", "advanced"
    private String status; // "Approved", "Pending", "Rejected"
    private List<String> genres;
    private List<String> moods;
    private List<String> themes;
    private Double minPrice;
    private Double maxPrice;
    private int page;
    private int size;

    public AudioTrackSearchRequest() {
        this.page = 0;
        this.size = 20;
        this.searchType = "full-text";
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getSearchType() {
        return searchType;
    }

    public void setSearchType(String searchType) {
        this.searchType = searchType;
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

    public Double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}

