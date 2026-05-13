package com.example.productservice.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Category {
    TV("TV"),
    BUZDOLABI("Buzdolabı"),
    BULASIK_MAKINESI("Bulaşık Makinesi"),
    CAMASIR_MAKINESI("Çamaşır Makinesi"),
    KURUTMA_MAKINESI("Kurutma Makinesi"),
    TELEFON("Telefon"),
    BILGISAYAR("Bilgisayar"),
    KLIMA("Klima");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static Category fromString(String value) {
        if (value == null) {
            return null;
        }
        
        for (Category category : Category.values()) {
            if (category.displayName.equalsIgnoreCase(value.trim())) {
                return category;
            }
        }
        
        for (Category category : Category.values()) {
            if (category.name().equalsIgnoreCase(value.trim())) {
                return category;
            }
        }
        
        throw new IllegalArgumentException("Geçersiz kategori: " + value + 
            ". Geçerli değerler: TV, Buzdolabı, Bulaşık Makinesi, Çamaşır Makinesi, Kurutma Makinesi, Telefon, Bilgisayar");
    }

    public MainCategory getMainCategory() {
        return switch (this) {
            case TV, TELEFON, BILGISAYAR -> MainCategory.ELEKTRONIK;
            case BUZDOLABI, BULASIK_MAKINESI, CAMASIR_MAKINESI, KURUTMA_MAKINESI -> MainCategory.BEYAZ_ESYA;
            case KLIMA -> MainCategory.IKLIMLERDIRME;
            default -> MainCategory.EV_ALETLERI;
        };
    }
}