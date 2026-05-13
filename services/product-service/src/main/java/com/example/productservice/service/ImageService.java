package com.example.productservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ImageService {

    private static final String UPLOAD_DIR = "uploads/";

    public String saveImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR);

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        Path filePath = path.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "http://localhost/uploads/" + fileName;
    }
}
