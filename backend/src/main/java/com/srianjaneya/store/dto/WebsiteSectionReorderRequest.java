package com.srianjaneya.store.dto;

import java.util.List;

public class WebsiteSectionReorderRequest {

    private List<SectionOrder> orders;

    public WebsiteSectionReorderRequest() {}

    public List<SectionOrder> getOrders() { return orders; }
    public void setOrders(List<SectionOrder> orders) { this.orders = orders; }

    public static class SectionOrder {
        private String sectionKey;
        private Integer displayOrder;

        public SectionOrder() {}

        public String getSectionKey() { return sectionKey; }
        public void setSectionKey(String sectionKey) { this.sectionKey = sectionKey; }

        public Integer getDisplayOrder() { return displayOrder; }
        public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    }
}
