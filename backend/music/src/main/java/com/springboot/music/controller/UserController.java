package com.springboot.music.controller;

import com.springboot.music.dto.LibraryItemDTO;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.service.OrderService;
import com.springboot.music.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/library")
    public ResponseEntity<List<LibraryItemDTO>> getUserLibrary(Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<LibraryItemDTO> libraryItems = userService.getUserLibrary(user.getId());
        return ResponseEntity.ok(libraryItems);
    }

}
