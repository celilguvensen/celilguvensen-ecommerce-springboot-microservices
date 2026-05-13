package com.example.orderservice.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    @NotBlank(message = "Adres başlığı gereklidir")
    @Size(max = 50, message = "Adres başlığı 50 karakteri geçemez")
    private String title;
    
    @NotBlank(message = "Ad soyad gereklidir")
    @Size(min = 2, max = 100, message = "Ad soyad 2-100 karakter arasında olmalıdır")
    private String fullName;
    
    @NotBlank(message = "Şehir gereklidir")
    @Size(max = 50, message = "Şehir adı 50 karakteri geçemez")
    private String city;
    
    @NotBlank(message = "İlçe gereklidir")
    @Size(max = 50, message = "İlçe adı 50 karakteri geçemez")
    private String district;
    
    @NotBlank(message = "Sokak/cadde bilgisi gereklidir")
    @Size(max = 200, message = "Sokak bilgisi 200 karakteri geçemez")
    private String street;
    
    @NotBlank(message = "Posta kodu gereklidir")
    @Pattern(regexp = "^[0-9]{5}$", message = "Posta kodu 5 haneli sayı olmalıdır")
    private String postalCode;
    
    @Size(max = 500, message = "Açıklama 500 karakteri geçemez")
    private String description;
}