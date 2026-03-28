package com.stockanalyzer.model;

import lombok.Data;
import java.util.List;

@Data
public class StockData {

    // Table 1 - Company Overview
    private String companyName;
    private String symbol;
    private String cmp;
    private String pe;
    private String marketCap;
    private String dividendYield;
    private String bookValue;
    private String roe;

    // Table 2 - Financial History (last 3 years)
    private List<YearlyFinancial> financials;

    // Table 3 - Median PE
    private String medianPe1Year;
    private String medianPe3Year;
    private String medianPe5Year;

    @Data
    public static class YearlyFinancial {
        private String year;
        private String revenue;
        private String profit;
        private String revenueGrowth;
        private String profitGrowth;
        private String netProfitMargin;
    }
}
