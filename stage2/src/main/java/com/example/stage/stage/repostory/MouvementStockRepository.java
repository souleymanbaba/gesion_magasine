package com.example.stage.stage.repostory;



import com.example.stage.stage.dto.MonthlySortiesData;
import com.example.stage.stage.entity.MouvementStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.stage.stage.entity.MouvementStock;
import com.example.stage.stage.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {
    List<MouvementStock> findByProductId(Long productId);
    @Query("SELECT SUM(m.quantite * p.price) FROM MouvementStock m JOIN m.product p WHERE m.type = ?1")
    double sumTotalPriceByType(MouvementStock.TypeMouvement type);

    @Query("SELECT m.product, SUM(m.quantite) as totalQuantite FROM MouvementStock m JOIN m.product p WHERE m.type = ?1 GROUP BY m.product ORDER BY totalQuantite ASC")
    List<Object[]> findProductWithMinSorties(MouvementStock.TypeMouvement type);

    @Query("SELECT m.product, SUM(m.quantite) as totalQuantite FROM MouvementStock m JOIN m.product p WHERE m.type = ?1 GROUP BY m.product ORDER BY totalQuantite DESC")
    List<Object[]> findProductWithMaxSorties(MouvementStock.TypeMouvement type);

    @Query("SELECT SUM(m.quantite * p.price) FROM MouvementStock m JOIN m.product p WHERE m.type = 'SORTIE' AND m.dateMouvement BETWEEN ?1 AND ?2")
    Double sumTotalPriceByTypeAndDate(LocalDateTime startOfMonth, LocalDateTime endOfMonth);

    @Query("SELECT new com.example.stage.stage.dto.MonthlySortiesData(MONTH(m.dateMouvement), SUM(m.quantite * p.price)) " +
            "FROM MouvementStock m JOIN m.product p " +
            "WHERE m.type = 'SORTIE' AND m.dateMouvement BETWEEN :startDate AND :endDate " +
            "GROUP BY MONTH(m.dateMouvement)")
    List<MonthlySortiesData> findTotalSortiesForLastThreeMonths(LocalDateTime startDate, LocalDateTime endDate);
}

