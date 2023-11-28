package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;


    @MessageMapping("chat")
    @SendTo("/topic/chat")
    public void chat(@Payload String payload) {
        chatService.processChatMessage(payload);
    }

}

