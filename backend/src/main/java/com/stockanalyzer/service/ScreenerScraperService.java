package com.stockanalyzer.service;

import com.stockanalyzer.model.StockData;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class ScreenerScraperService {

    private static final String BASE_URL = "https://www.screener.in/company/";
    private static final String SEARCH_URL = "https://www.screener.in/api/company/search/?q=";
    private static final String USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    public StockData fetchStockData(String input) throws IOException {
        String symbol = resolveSymbol(input);

        String url = BASE_URL + symbol + "/consolidated/";
        Document doc;

        try {
            doc = Jsoup.connect(url).userAgent(USER_AGENT).timeout(15000).get();
        } catch (IOException e) {
            url = BASE_URL + symbol + "/";
            doc = Jsoup.connect(url).userAgent(USER_AGENT).timeout(15000).get();
        }

        StockData stockData = new StockData();
        stockData.setSymbol(symbol);

        Element nameEl = doc.selectFirst("h1.margin-0");
        if (nameEl != null) stockData.setCompanyName(nameEl.text());

        Elements ratioItems = doc.select("#top-ratios li");
        for (Element item : ratioItems) {
            String label = item.select(".name").text().trim().toLowerCase();
            // Use .first() to avoid duplicate text from nested spans
            Element valueEl = item.selectFirst(".value span, .number span, .value, .number");
            String value = valueEl != null ? valueEl.text().trim() : "";

            if (label.contains("current price") || label.contains("cmp")) stockData.setCmp(value);
            else if (label.equals("p/e") || label.contains("stock p/e")) stockData.setPe(value);
            else if (label.contains("market cap")) stockData.setMarketCap(value);
            else if (label.contains("dividend yield")) stockData.setDividendYield(value);
            else if (label.contains("book value")) stockData.setBookValue(value);
            else if (label.contains("roe") || label.contains("return on equity")) stockData.setRoe(value);
        }

        stockData.setFinancials(extractFinancials(doc));
        extractMedianPE(doc, stockData);

        return stockData;
    }

    private String resolveSymbol(String input) {
        String trimmed = input.trim();
        if (!trimmed.contains(" ")) return trimmed.toUpperCase();

        try {
            String searchQuery = trimmed.replace(" ", "+");
            Document searchDoc = Jsoup.connect(SEARCH_URL + searchQuery + "&autocomplete=1")
                    .userAgent(USER_AGENT).ignoreContentType(true).timeout(10000).get();
            String body = searchDoc.body().text();
            if (body.contains("\"/company/")) {
                int urlIdx = body.indexOf("\"/company/");
                int start = urlIdx + 10;
                int end = body.indexOf("/", start);
                if (end != -1) return body.substring(start, end).toUpperCase();
            }
        } catch (Exception ignored) {}

        return trimmed.replace(" ", "").toUpperCase();
    }

    private List<StockData.YearlyFinancial> extractFinancials(Document doc) {
        List<StockData.YearlyFinancial> financials = new ArrayList<>();
        Element plSection = doc.selectFirst("#profit-loss");
        if (plSection == null) return financials;
        Element table = plSection.selectFirst("table");
        if (table == null) return financials;

        Elements headers = table.select("thead tr th");
        List<String> years = new ArrayList<>();
        for (int i = 1; i < headers.size(); i++) {
            String yr = headers.get(i).text().trim();
            if (!yr.isEmpty() && !yr.equalsIgnoreCase("TTM")) years.add(yr);
        }

        List<String> revenues = new ArrayList<>();
        List<String> profits = new ArrayList<>();

        for (Element row : table.select("tbody tr")) {
            String rowLabel = row.select("td").first() != null
                    ? row.select("td").first().text().trim().toLowerCase() : "";
            Elements cells = row.select("td");
            if (rowLabel.contains("sales") || rowLabel.contains("revenue")) {
                for (int i = 1; i < cells.size() && i <= years.size(); i++)
                    revenues.add(cells.get(i).text().trim());
            }
            if (rowLabel.contains("net profit") && !rowLabel.contains("margin")) {
                for (int i = 1; i < cells.size() && i <= years.size(); i++)
                    profits.add(cells.get(i).text().trim());
            }
        }

        int start = Math.max(0, years.size() - 3);
        for (int i = start; i < years.size(); i++) {
            StockData.YearlyFinancial yf = new StockData.YearlyFinancial();
            yf.setYear(years.get(i));
            yf.setRevenue(i < revenues.size() ? revenues.get(i) : "N/A");
            yf.setProfit(i < profits.size() ? profits.get(i) : "N/A");
            if (i > 0) {
                yf.setRevenueGrowth(calculateGrowth(
                        i - 1 < revenues.size() ? revenues.get(i - 1) : null,
                        i < revenues.size() ? revenues.get(i) : null));
                yf.setProfitGrowth(calculateGrowth(
                        i - 1 < profits.size() ? profits.get(i - 1) : null,
                        i < profits.size() ? profits.get(i) : null));
            } else {
                yf.setRevenueGrowth("—");
                yf.setProfitGrowth("—");
            }
            try {
                double rev = Double.parseDouble(revenues.get(i).replace(",", ""));
                double prof = Double.parseDouble(profits.get(i).replace(",", ""));
                yf.setNetProfitMargin(String.format("%.1f%%", (prof / rev) * 100));
            } catch (Exception e) {
                yf.setNetProfitMargin("N/A");
            }
            financials.add(yf);
        }
        return financials;
    }

    private void extractMedianPE(Document doc, StockData stockData) {
        try {
            // Get company ID from the page
            Element companyEl = doc.selectFirst("[data-company-id]");
            if (companyEl == null) {
                // Try alternate selector
                companyEl = doc.selectFirst("div[data-company]");
            }

            // Fallback: extract from page source directly
            String companyId = null;
            String html = doc.html();
            int idx = html.indexOf("\"company\":");
            if (idx == -1) idx = html.indexOf("company_id");
            if (idx != -1) {
                String sub = html.substring(idx, Math.min(idx + 50, html.length()));
                companyId = sub.replaceAll("[^0-9]", "").substring(0, Math.min(6, sub.replaceAll("[^0-9]", "").length()));
            }

            if (companyId == null || companyId.isEmpty()) {
                fallbackToCurrentPe(stockData);
                return;
            }

            // Call screener chart API for PE data
            String apiUrl = "https://www.screener.in/api/company/" + companyId + "/chart/?q=Price+to+Earning&days=1825";
            Document apiDoc = Jsoup.connect(apiUrl)
                    .userAgent(USER_AGENT)
                    .ignoreContentType(true)
                    .timeout(10000)
                    .get();

            String json = apiDoc.body().text();
            // Response: {"datasets":[{"label":"Price to Earning","data":[[timestamp,value],...]}]}
            List<Double> peValues = parsePeFromJson(json);

            if (peValues.isEmpty()) {
                fallbackToCurrentPe(stockData);
                return;
            }

            int total = peValues.size();
            // Data is daily — 365 points = 1yr, 1095 = 3yr, 1825 = 5yr
            int oneYrIdx   = Math.max(0, total - 365);
            int threeYrIdx = Math.max(0, total - 1095);

            List<Double> oneYr   = new ArrayList<>(peValues.subList(oneYrIdx, total));
            List<Double> threeYr = new ArrayList<>(peValues.subList(threeYrIdx, total));
            List<Double> fiveYr  = new ArrayList<>(peValues);

            Collections.sort(oneYr);
            Collections.sort(threeYr);
            Collections.sort(fiveYr);

            stockData.setMedianPe1Year(String.format("%.1f", median(oneYr)));
            stockData.setMedianPe3Year(String.format("%.1f", median(threeYr)));
            stockData.setMedianPe5Year(String.format("%.1f", median(fiveYr)));

        } catch (Exception e) {
            fallbackToCurrentPe(stockData);
        }
    }

    private List<Double> parsePeFromJson(String json) {
        List<Double> values = new ArrayList<>();
        // Find the data array: "data":[[ts,val],[ts,val],...]
        int dataIdx = json.indexOf("\"data\":");
        if (dataIdx == -1) return values;

        int arrStart = json.indexOf("[", dataIdx + 7);
        int arrEnd   = json.lastIndexOf("]");
        if (arrStart == -1 || arrEnd == -1) return values;

        String dataArr = json.substring(arrStart, arrEnd + 1);
        // Each entry is [timestamp, peValue]
        String[] entries = dataArr.split("\\[");
        for (String entry : entries) {
            try {
                String[] parts = entry.replace("]", "").split(",");
                if (parts.length >= 2) {
                    double pe = Double.parseDouble(parts[1].trim());
                    if (pe > 0 && pe < 500) values.add(pe);
                }
            } catch (NumberFormatException ignored) {}
        }
        return values;
    }

    private void fallbackToCurrentPe(StockData stockData) {
        try {
            String peRaw = stockData.getPe() != null ? stockData.getPe().split(" ")[0].replace(",", "") : "0";
            double currentPe = Double.parseDouble(peRaw);
            if (currentPe > 0) {
                stockData.setMedianPe1Year(String.format("%.1f", currentPe));
                stockData.setMedianPe3Year(String.format("%.1f", currentPe));
                stockData.setMedianPe5Year(String.format("%.1f", currentPe));
                return;
            }
        } catch (Exception ignored) {}
        stockData.setMedianPe1Year("N/A");
        stockData.setMedianPe3Year("N/A");
        stockData.setMedianPe5Year("N/A");
    }

    private double median(List<Double> sorted) {
        int n = sorted.size();
        if (n == 0) return 0;
        if (n % 2 == 0) return (sorted.get(n / 2 - 1) + sorted.get(n / 2)) / 2.0;
        return sorted.get(n / 2);
    }

    private String calculateGrowth(String prev, String curr) {
        try {
            double p = Double.parseDouble(prev.replace(",", ""));
            double c = Double.parseDouble(curr.replace(",", ""));
            return String.format("%.1f%%", ((c - p) / Math.abs(p)) * 100);
        } catch (Exception e) {
            return "N/A";
        }
    }
}
