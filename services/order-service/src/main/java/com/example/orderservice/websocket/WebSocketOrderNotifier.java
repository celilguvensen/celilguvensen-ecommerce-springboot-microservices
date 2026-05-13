package com.example.orderservice.websocket;

import com.example.orderservice.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketOrderNotifier {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyOrderUpdate(Order order) {
        String destination = "/topic/orders/" + order.getUserId();
        messagingTemplate.convertAndSend(destination, order);
    }
}
