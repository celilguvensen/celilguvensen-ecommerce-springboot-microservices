package com.example.productservice.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MainCategory {
    ELEKTRONIK("Elektronik"),
    BEYAZ_ESYA("Beyaz Eşya"),
    EV_ALETLERI("Ev Aletleri"),
    ANKASTRE("Ankastre"),
    IKLIMLERDIRME("İklimlendirme"),
    AKILLI_URUNLER("Akilli Ürünler");

    private final String displayName;

    MainCategory(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static MainCategory fromString(String value) {
        if (value == null) {
            return null;
        }
        
        for (MainCategory category : MainCategory.values()) {
            if (category.displayName.equalsIgnoreCase(value.trim())) {
                return category;
            }
        }
        
        for (MainCategory category : MainCategory.values()) {
            if (category.name().equalsIgnoreCase(value.trim())) {
                return category;
            }
        }
        
        throw new IllegalArgumentException("Geçersiz ana kategori: " + value + 
            ". Geçerli değerler: Elektronik, Beyaz Eşya, Ev Aletleri");
    }
}