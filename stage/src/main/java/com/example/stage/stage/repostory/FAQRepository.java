package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FAQRepository extends JpaRepository<FAQ,Long> {

}
