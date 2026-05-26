package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AudioTrackRepository extends JpaRepository<AudioTrack, Integer>, JpaSpecificationExecutor<AudioTrack> {

    // Tìm kiếm theo trạng thái (Pending, Approved, Rejected)
    List<AudioTrack> findByStatusIgnoreCase(String status);

    Page<AudioTrack> findByStatusIgnoreCase(String status, Pageable pageable);

    // Tìm kiếm theo nghệ sĩ
    @Query("select distinct a.artist from AudioTrack a where a.artist is not null")
    List<User> findDistinctArtists();

    // Tìm kiếm theo tên bài hát (chứa chuỗi con, không phân biệt hoa thường)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update AudioTrack a set a.playCount = coalesce(a.playCount, 0) + 1 where a.id = :audioId")
    int incrementPlayCount(@Param("audioId") Integer audioId);

    // Lấy số lần phát của một bài hát
    @Query("select coalesce(a.playCount, 0) from AudioTrack a where a.id = :audioId")
    Integer findPlayCountById(@Param("audioId") Integer audioId);

    // Đếm số tác phẩm đang bán
    @Query("SELECT COUNT(a) FROM AudioTrack a WHERE a.artist.id = :artistId AND UPPER(a.status) = 'APPROVED'")
    Long countActiveTracksByArtistId(@Param("artistId") Integer artistId);

    // Tổng lượt nghe/tải xuống tích lũy của tất cả tác phẩm thuộc artist
    @Query("SELECT COALESCE(SUM(COALESCE(a.playCount, 0)), 0) FROM AudioTrack a WHERE a.artist.id = :artistId")
    long sumPlayCountByArtistId(@Param("artistId") Integer artistId);

    // Lấy danh sách bài hát của một nghệ sĩ, sắp xếp theo ngày tải lên mới nhất
    @Query(value = """
            SELECT a
            FROM AudioTrack a
            WHERE a.artist.id = :artistId
            ORDER BY a.uploadDate DESC
            """,
            countQuery = """
            SELECT COUNT(a)
            FROM AudioTrack a
            WHERE a.artist.id = :artistId
            """)
    Page<AudioTrack> findByArtistId(@Param("artistId") Integer artistId, Pageable pageable);

    // Thống kê số lượng bài hát theo loại âm thanh
    @Query("""
            SELECT COALESCE(a.audioType, 'Unknown'), COUNT(a)
            FROM AudioTrack a
            GROUP BY COALESCE(a.audioType, 'Unknown')
            """)
    List<Object[]> countByAudioType();

    // Lấy danh sách các bài hát không bị xóa
    @Query("SELECT a FROM AudioTrack a WHERE a.isDeleted = false OR a.isDeleted IS NULL ORDER BY a.uploadDate DESC")
    Page<AudioTrack> findAllNotDeleted(Pageable pageable);

    // Lấy danh sách bài hát không bị xóa với filter theo tiêu đề, loại âm thanh, và trạng thái
    @Query("""
            SELECT a FROM AudioTrack a
            WHERE (a.isDeleted = false OR a.isDeleted IS NULL)
            AND (:title IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :title, '%')))
            AND (:audioType IS NULL OR LOWER(a.audioType) = LOWER(:audioType))
            AND (:status IS NULL OR LOWER(a.status) = LOWER(:status))
            ORDER BY a.uploadDate DESC
            """)
    Page<AudioTrack> findAllNotDeletedWithFilters(
            @Param("title") String title,
            @Param("audioType") String audioType,
            @Param("status") String status,
            Pageable pageable);

}
