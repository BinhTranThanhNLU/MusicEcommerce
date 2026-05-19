package com.springboot.music.repository;

import com.springboot.music.document.AudioTrackDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AudioTrackSearchRepository extends ElasticsearchRepository<AudioTrackDocument, String> {

}
