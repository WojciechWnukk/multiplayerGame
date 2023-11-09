package com.gameServer.gameSerwer.WebSocket;

public class IncomingMessage {
    private String name;
    public String getName() {
        return name;
    }

    public void setName(String newName) {
        name = newName;
    }

    public IncomingMessage(String name) {
        this.name = name;
    }

    public IncomingMessage() {
    }
}
