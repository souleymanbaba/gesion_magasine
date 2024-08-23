package com.example.stage.stage.entity;
import com.example.stage.stage.dto.CategoryDto;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data

public class config {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "config_key")
    private String key;
    private int prix_minimal;

}
