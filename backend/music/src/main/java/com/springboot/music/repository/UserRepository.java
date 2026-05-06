package com.springboot.music.repository;

import com.springboot.music.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
            "(:keyword IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:roleName IS NULL OR u.role.name = :roleName) " +
            "AND (:isActive IS NULL OR u.isActive = :isActive)")
    Page<User> findUsersByAdminFilter(@Param("keyword") String keyword,
                                      @Param("roleName") String roleName,
                                      @Param("isActive") Boolean isActive,
                                      Pageable pageable);

}
