package com.example.stage.stage.services.admin.adminProduct;

import com.example.stage.stage.dto.MonthlySortiesData;
import com.example.stage.stage.dto.MouvementStockDto;
import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.dto.ProductMouvementCountDto;
import com.example.stage.stage.entity.MouvementStock;
import com.example.stage.stage.entity.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

public interface ProductService {
    ProductDto addProduct (ProductDto productDto) throws IOException;

    ProductDto updateProductTranslation(Long productId, ProductDto productDto);
    List<ProductDto> getAllProductByName(String name, String lang);
    boolean deleteProduct(Long id);
    ProductDto getProductById(Long productId, String lang);
    ProductDto updateProduct(Long productId, ProductDto productDto) throws IOException;
    List<ProductDto> getProductsByCategoryAndSubcategories(Long categoryId, String lang);
    List<ProductDto> convertToDtoList(List<Product> products, String lang);
    List<ProductDto> getAllProducts(String lang);
    void addMouvementStock(MouvementStockDto mouvementStockDto);
    List<MouvementStock> getMouvementsByProductId(Long productId);
    void saveProductsFromExcel(MultipartFile file);
    ProductMouvementCountDto getProductWithMaxSorties();
    ProductMouvementCountDto getProductWithMinSorties();
    double getTotalSorties();
    Double getTotalSortiesCurrentMonth();
    List<MonthlySortiesData> getTotalSortiesForLastThreeMonths();
}
