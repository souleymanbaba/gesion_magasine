package com.example.stage.stage.controller.admin;


import com.example.stage.stage.dto.CategoryDto;
import com.example.stage.stage.entity.Category;
import com.example.stage.stage.services.admin.Category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/api/admin")
    @RequiredArgsConstructor
    public class AdminCategoryController {

        private final CategoryService categoryService;


        @PostMapping("/category")
        public ResponseEntity<Category> createCategory(@RequestBody CategoryDto categoryDto) {
            Category category =categoryService.createcategory(categoryDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(category);

        }

    @GetMapping("/{categoryId}/subcategories")
    public ResponseEntity<List<CategoryDto>> getCategoryAndSubcategories(@PathVariable Long categoryId) {
        List<CategoryDto> categories = categoryService.getCategoryAndSubcategories(categoryId);
        return ResponseEntity.ok(categories);
    }
    @GetMapping("")
            public ResponseEntity<List<Category>> getAllCategories(){
            return ResponseEntity.ok(categoryService.getAllCategories());
            }


    }
