package com.commonsecurity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final Key key;

    @Value("${jwt.access.token.expiration:900000}") 
    private long expiration;

    public JwtService(@Value("${jwt.secret}") String secretString) {
        this.key = Keys.hmacShaKeyFor(secretString.getBytes());
    }

    public String generateToken(String username, String role, String userId, String email) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("userId", userId)
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return getAllClaims(token).getSubject();
    }

    public String extractUserId(String token) {
        return getAllClaims(token).get("userId", String.class);
    }

    public String extractRole(String token) {
        return getAllClaims(token).get("role", String.class);
    }

    public String extractEmail(String token) {
        return getAllClaims(token).get("email", String.class);
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
