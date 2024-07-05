package com.example.stage.stage.services.admin.adminProduct;

import com.example.stage.stage.dto.MonthlySortiesData;
import com.example.stage.stage.dto.MouvementStockDto;
import com.example.stage.stage.dto.ProductDto;
import com.example.stage.stage.dto.ProductMouvementCountDto;
import com.example.stage.stage.entity.Category;
import com.example.stage.stage.entity.Marque;
import com.example.stage.stage.entity.MouvementStock;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.repostory.CategoryRepository;
import com.example.stage.stage.repostory.MarqueRepository;
import com.example.stage.stage.repostory.MouvementStockRepository;
import com.example.stage.stage.repostory.ProcuctRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.logging.Logger;
@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {
    private final ProcuctRepository productRepository;
    private final CategoryRepository categoryRepository;

    private final MouvementStockRepository mouvementStockRepository;

    private final MarqueRepository marqueRepository;



    public void addMouvementStock(MouvementStockDto mouvementStockDto) {
        Product product = productRepository.findById(mouvementStockDto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        MouvementStock mouvementStock = new MouvementStock();
        mouvementStock.setProduct(product);
        mouvementStock.setType(mouvementStockDto.getType());
        mouvementStock.setQuantite(mouvementStockDto.getQuantite());
        mouvementStock.setDateMouvement(mouvementStockDto.getDateMouvement());
        mouvementStock.setRemarque(mouvementStockDto.getRemarque());
        mouvementStockRepository.save(mouvementStock);
        product.updateStockQuantity(mouvementStockDto.getQuantite(), mouvementStockDto.getType());

        productRepository.save(product);
    }

    public ProductDto addProduct(ProductDto productDto) throws IOException {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImg(productDto.getImg().getBytes());
        Optional<Marque> optionalMarque = marqueRepository.findById(productDto.getMarqueId());
        if (optionalMarque.isPresent()) {
            product.setMarque(optionalMarque.get());
        } else {
            throw new IllegalArgumentException("Marque not found");
        }
        product.setTaille(productDto.getTaille());
        product.setName_ar(productDto.getName_ar());
        product.setDescription_ar(productDto.getDescription_ar());
        product.setTaille_ar(productDto.getTaille_ar());
        Category category = categoryRepository.findById(productDto.getCategoryId()).orElseThrow();
        product.setCategory(category);
        product.setQuantiteStock(productDto.getQuantiteStock());
        return productRepository.save(product).getDto("fr");
    }

    public List<ProductDto> getAllProducts(String lang) {
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> product.getDto(lang)).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductByName(String name, String lang) {
        List<Product> products = productRepository.findAllByNameContaining(name);
        return products.stream().map(product -> product.getDto(lang)).collect(Collectors.toList());
    }

    public List<ProductDto> getProductsByCategoryAndSubcategories(Long categoryId, String lang) {
        List<Product> products = productRepository.findByCategoryAndSubcategories(categoryId);
        return convertToDtoList(products, lang);
    }

    public List<ProductDto> convertToDtoList(List<Product> products, String lang) {
        List<ProductDto> productDtos = new ArrayList<>();
        for (Product product : products) {
            ProductDto productDto = new ProductDto();
            productDto.setId(product.getId());
            if("ar".equals(lang) && product.getName_ar()!=null )  productDto.setName(product.getName_ar());
            else  productDto.setName( product.getName());
            productDto.setPrice(product.getPrice());
            if(product.getDescription_ar() !=null && "ar".equals(lang) )  productDto.setDescription(product.getDescription_ar());
            else productDto.setDescription( product.getDescription());
            productDto.setByteimg(product.getImg());
            productDto.setCategoryId(product.getCategory().getId());
            productDto.setCategoryName(product.getCategory().getName());
            if ("ar".equals(lang) && product.getMarque().getNom_ar() != null) {
                productDto.setMarque(product.getMarque().getNom_ar());
            } else {
                productDto.setMarque(product.getMarque().getNom());
            }
            if("ar".equals(lang) && product.getTaille_ar()!=null)  productDto.setTaille(product.getTaille_ar());
            else productDto.setTaille( product.getTaille());
            productDtos.add(productDto);
        }
        return productDtos;
    }

    public void saveProductsFromExcel(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue;
                }

                Product product = new Product();
                product.setName(row.getCell(0).getStringCellValue());
                product.setPrice((long) row.getCell(1).getNumericCellValue());
                String marque = row.getCell(2).getStringCellValue();
                product.setTaille(row.getCell(3).getStringCellValue());
                product.setDescription(row.getCell(4).getStringCellValue());
                product.setQuantiteStock((int) row.getCell(5).getNumericCellValue());

                Marque marque1 = marqueRepository.findByNom(marque);
                if (marque1 == null) {
                    marque1 = marqueRepository.findByNom("autre");
                    if (marque1 == null) {


                    throw new RuntimeException("Erreur : la marque " + marque + " n'a pas été trouvée.");
                    }
                }

                String categoryName = row.getCell(6).getStringCellValue();
                Category category = categoryRepository.findByName(categoryName);
                if (category == null) {
                    category = categoryRepository.findByName("autre");
                    if (category == null) {
                        throw new RuntimeException("Erreur : la catégorie " + categoryName + " et la catégorie 'autre' n'ont pas été trouvées.");
                    }
                }

                product.setCategory(category);
                product.setMarque(marque1);

                productRepository.save(product);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Excel file", e);
        }
    }


    public boolean deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            productRepository.deleteById(id);
        }
        return optionalProduct.isPresent();
    }

    public ProductDto getProductById(Long productId, String lang) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        return optionalProduct.map(product -> product.getDto(lang)).orElse(null);
    }

    public ProductDto updateProduct(Long productId, ProductDto productDto) throws IOException {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Optional<Category> optionalCategory = categoryRepository.findById(productDto.getCategoryId());
        if (optionalProduct.isPresent() && optionalCategory.isPresent()) {
            Product product = optionalProduct.get();
            product.setName(productDto.getName());
            product.setPrice(productDto.getPrice());
            product.setDescription(productDto.getDescription());
            product.setCategory(optionalCategory.get());
            product.setName_ar(productDto.getName_ar());
            product.setDescription_ar(productDto.getDescription_ar());
            product.setTaille_ar(productDto.getTaille_ar());
            if (productDto.getImg() != null) {
                product.setImg(productDto.getImg().getBytes());
            }
            return productRepository.save(product).getDto("fr");
        } else {
            return null;
        }
    }

    public double getTotalSorties() {
        return mouvementStockRepository.sumTotalPriceByType(MouvementStock.TypeMouvement.SORTIE);
    }
    private static final Logger logger = Logger.getLogger(ProductService.class.getName());

    public ProductMouvementCountDto getProductWithMinSorties() {
        logger.info("Fetching product with minimum sorties...");
        List<Object[]> results = mouvementStockRepository.findProductWithMinSorties(MouvementStock.TypeMouvement.SORTIE);
        if (!results.isEmpty()) {
            Object[] result = results.get(0);
            return new ProductMouvementCountDto((Product) result[0], ((Number) result[1]).intValue());
        } else {
            logger.warning("No results found for minimum sorties");
        }
        return null;
    }

    public ProductMouvementCountDto getProductWithMaxSorties() {
        logger.info("Fetching product with maximum sorties...");
        List<Object[]> results = mouvementStockRepository.findProductWithMaxSorties(MouvementStock.TypeMouvement.SORTIE);
        if (!results.isEmpty()) {
            Object[] result = results.get(0);
            return new ProductMouvementCountDto((Product) result[0], ((Number) result[1]).intValue());
        } else {
            logger.warning("No results found for maximum sorties");
        }
        return null;
    }

    public ProductDto updateProductTranslation(Long productId, ProductDto productDto) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            if (productDto.getName_ar() != null) {
                product.setName_ar(productDto.getName_ar());
            }
            if (productDto.getDescription_ar() != null) {
                product.setDescription_ar(productDto.getDescription_ar());
            }

            if (productDto.getTaille_ar() != null) {
                product.setTaille_ar(productDto.getTaille_ar());
            }
            return productRepository.save(product).getDto("ar");
        } else {
            return null;
        }
    }

    public List<MonthlySortiesData> getTotalSortiesForLastThreeMonths() {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(3).withDayOfMonth(1).toLocalDate().atStartOfDay();

        return mouvementStockRepository.findTotalSortiesForLastThreeMonths(startDate, endDate);
    }
    public List<MouvementStock> getMouvementsByProductId(Long productId) {
        return mouvementStockRepository.findByProductId(productId);
    }
    public Double getTotalSortiesCurrentMonth() {
        YearMonth currentMonth = YearMonth.now(ZoneId.systemDefault());
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(23, 59, 59);

        return mouvementStockRepository.sumTotalPriceByTypeAndDate(startOfMonth, endOfMonth);
    }


}
