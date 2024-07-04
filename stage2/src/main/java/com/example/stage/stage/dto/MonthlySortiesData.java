package com.example.stage.stage.dto;
import lombok.Data;

@Data
public class MonthlySortiesData {

    private Integer month;
    private Long totalSorties;

    public MonthlySortiesData(Integer month, Long totalSorties) {
        this.month = month;
        this.totalSorties = totalSorties;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Long getTotalSorties() {
        return totalSorties;
    }

    public void setTotalSorties(Long totalSorties) {
        this.totalSorties = totalSorties;
    }
}
