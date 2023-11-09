package com.gameServer.gameSerwer.Controller;

import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.WebSocket.IncomingMessage;
import com.gameServer.gameSerwer.WebSocket.OutgoingMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }


    @MessageMapping("/process-message")
    @SendTo("/topic/messages")
    public OutgoingMessage processMessage(IncomingMessage incomingMessage) throws Exception {
        Thread.sleep(1000);
        System.out.println("dadadsa");

        return new OutgoingMessage("Hello, " + incomingMessage.getName());
    }

    @MessageMapping("/updatePosition")
    @SendTo("/topic/players")
    public User updatePosition(User user) throws Exception {
        Thread.sleep(1000);
        System.out.println("dadadsa");
        return user;
    }

    @MessageMapping("/killEntity")
    @SendTo("/topic/killEntity")
    public String killEntity(String id) throws Exception {
        Thread.sleep(1000);
        System.out.println("dadadsa");

        return id;
    }

    @MessageMapping("/{playerId}")
    @SendTo("/topic/players")
    public User movePlayer (String playerId, User user) throws Exception {
        Thread.sleep(1000);
        System.out.println("dadadsa");

        return user;
    }

}
