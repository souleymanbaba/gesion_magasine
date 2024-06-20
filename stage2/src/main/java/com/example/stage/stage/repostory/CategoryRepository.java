package com.example.stage.stage.repostory;

import com.example.stage.stage.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
    @Query("SELECT c FROM Category c WHERE c.id = :categoryId " +
            "OR c.parentCategory.id = :categoryId " +
            "OR c.parentCategory.id IN (SELECT sc.id FROM Category sc WHERE sc.parentCategory.id = :categoryId)")
    List<Category> findCategoryAndSubcategories(@Param("categoryId") Long categoryId);
    Category findByName(String name);
}