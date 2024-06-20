package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.Marque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MarqueRepository extends JpaRepository<Marque, Long> {

    Marque findByNom(String nom);
}
