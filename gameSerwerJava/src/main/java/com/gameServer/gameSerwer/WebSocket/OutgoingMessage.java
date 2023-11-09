package com.gameServer.gameSerwer.WebSocket;

public class OutgoingMessage {
    private String content;

    public OutgoingMessage(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String newContent) {
        content = newContent;
    }
}
