package com.example.orderservice.repository;

import com.example.orderservice.model.LocationHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface LocationHistoryRepository extends MongoRepository<LocationHistory, String> {
    List<LocationHistory> findByOrderIdOrderByTimestampDesc(String orderId);
    
    List<LocationHistory> findByOrderIdAndTimestampBetweenOrderByTimestampAsc(
        String orderId, LocalDateTime start, LocalDateTime end);
    
    @Query("{'courierId': ?0}")
    List<LocationHistory> findByCourierIdOrderByTimestampDesc(String courierId);
    
    @Query(value = "{'orderId': ?0}", sort = "{'timestamp': -1}")
    List<LocationHistory> findTopNByOrderId(String orderId);
    
    @Query("{'timestamp': {$gte: ?0}}")
    List<LocationHistory> findRecentLocations(LocalDateTime since);
}