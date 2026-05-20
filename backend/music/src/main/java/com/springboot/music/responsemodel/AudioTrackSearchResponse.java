package com.springboot.music.responsemodel;

import com.springboot.music.document.AudioTrackDocument;
import java.util.List;

/**
 * Response model cho tìm kiếm
 */
public class AudioTrackSearchResponse {

    private List<AudioTrackDocument> results;
    private int page;
    private int size;
    private long totalResults;
    private long totalPages;
    private String searchType;
    private String query;

    public AudioTrackSearchResponse() {
    }

    public AudioTrackSearchResponse(List<AudioTrackDocument> results, int page, int size,
                                   long totalResults, String searchType, String query) {
        this.results = results;
        this.page = page;
        this.size = size;
        this.totalResults = totalResults;
        this.totalPages = (totalResults + size - 1) / size;
        this.searchType = searchType;
        this.query = query;
    }

    public List<AudioTrackDocument> getResults() {
        return results;
    }

    public void setResults(List<AudioTrackDocument> results) {
        this.results = results;
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

    public long getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(long totalResults) {
        this.totalResults = totalResults;
    }

    public long getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(long totalPages) {
        this.totalPages = totalPages;
    }

    public String getSearchType() {
        return searchType;
    }

    public void setSearchType(String searchType) {
        this.searchType = searchType;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}

