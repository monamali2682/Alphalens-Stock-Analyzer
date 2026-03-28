package com.stockanalyzer.controller;

import com.stockanalyzer.model.StockData;
import com.stockanalyzer.service.ScreenerScraperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "http://localhost:3000")
public class StockController {

    @Autowired
    private ScreenerScraperService scraperService;

    @GetMapping("/{symbol}")
    public ResponseEntity<?> getStockData(@PathVariable String symbol) {
        try {
            StockData data = scraperService.fetchStockData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Could not fetch data for: " + symbol + ". Please check the symbol and try again.")
            );
        }
    }
}
