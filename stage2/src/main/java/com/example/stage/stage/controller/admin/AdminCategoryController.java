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
        Category category = categoryService.createcategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    @PutMapping("/category/{categoryId}/translate")
    public ResponseEntity<Category> updateCategoryTranslation(@PathVariable Long categoryId,
                                                              @RequestBody CategoryDto categoryDto,
                                                              @RequestParam(defaultValue = "fr") String lang) {
        Category updatedCategory = categoryService.updateCategoryTranslation(categoryId, categoryDto);
        if (updatedCategory != null) {
            return ResponseEntity.ok(updatedCategory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/ouvert/{categoryId}/subcategories")
    public ResponseEntity<List<CategoryDto>> getCategoryAndSubcategories(@PathVariable Long categoryId,
                                                                         @RequestParam(value = "lang", defaultValue = "fr") String lang) {
        List<CategoryDto> categories = categoryService.getCategoryAndSubcategories(categoryId, lang);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/ouvert/categories")
    public ResponseEntity<List<CategoryDto>> getAllCategories(@RequestParam(value = "lang", defaultValue = "fr") String lang) {
        List<CategoryDto> categories = categoryService.getAllCategories(lang);
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody CategoryDto categoryDto) {
        Category category = categoryService.updateCategory(id, categoryDto);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        boolean isDeleted = categoryService.deleteCategory(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
