package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.config;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigRepository extends JpaRepository<config, Long> {
    config findBykey(String key);

}
