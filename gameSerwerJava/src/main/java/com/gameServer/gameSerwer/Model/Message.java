package com.gameServer.gameSerwer.Model;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Message {
    private String inputMessage;
    private String author;
}