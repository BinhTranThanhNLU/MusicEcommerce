package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrackReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AudioTrackReviewRepository extends JpaRepository<AudioTrackReview, Integer> {

    interface RatingCountView {
        Integer getRating();

        Long getTotal();
    }

    @Query("""
            SELECT r
            FROM AudioTrackReview r
            JOIN FETCH r.audioTrack at
            JOIN FETCH r.user u
            WHERE at.id = :audioId
            ORDER BY r.createdAt DESC
            """)
    List<AudioTrackReview> findByAudioTrackIdWithUser(@Param("audioId") Integer audioId);

    @Query("""
            SELECT r
            FROM AudioTrackReview r
            JOIN FETCH r.audioTrack at
            JOIN FETCH r.user u
            WHERE u.id = :userId
            ORDER BY r.createdAt DESC
            """)
    List<AudioTrackReview> findByUserIdWithTrack(@Param("userId") Integer userId);

    Optional<AudioTrackReview> findByAudioTrack_IdAndUser_Id(Integer audioTrackId, Integer userId);

    long countByAudioTrack_Id(Integer audioTrackId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM AudioTrackReview r WHERE r.audioTrack.id = :audioId")
    Double getAverageRatingByAudioTrackId(@Param("audioId") Integer audioId);

    @Query("""
            SELECT r.rating AS rating, COUNT(r) AS total
            FROM AudioTrackReview r
            WHERE r.audioTrack.id = :audioId
            GROUP BY r.rating
            """)
    List<RatingCountView> countByAudioTrackIdGroupedByRating(@Param("audioId") Integer audioId);
}


