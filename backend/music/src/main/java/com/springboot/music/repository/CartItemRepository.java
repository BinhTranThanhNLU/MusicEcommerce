package com.springboot.music.repository;

import com.springboot.music.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    Optional<CartItem> findByCart_IdAndAudioTrack_IdAndLicense_Id(
            Integer cartId,
            Integer audioId,
            Integer licenseId
    );

    long deleteByCart_Id(Integer cartId);

}

