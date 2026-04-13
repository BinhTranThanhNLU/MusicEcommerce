package com.springboot.music.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Mood")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mood_id")
    private Integer id;

    @Column(name = "name")
    private String name;
}
