package com.gameServer.gameSerwer.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gameServer.gameSerwer.Model.Message;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;


@Controller
public class WebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;



    @MessageMapping("/connection")
    @SendTo("/topic/connection")
    public ResponseEntity<?> connection(@Payload Message payload) {
        Map<String, String> message = new HashMap<>();
        message.put("content", "Połączono z WebSocketem");

        System.out.println(payload.toString());
        //messagingTemplate.convertAndSend("/topic/connection", message);
        return ResponseEntity.status(200).body("Połączono z WebSocketem - serwer");
    }



}

