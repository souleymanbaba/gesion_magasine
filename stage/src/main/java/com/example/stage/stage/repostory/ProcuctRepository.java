package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcuctRepository extends JpaRepository<Product,Long> {

    List<Product> findAllByNameContaining(String name);
}
