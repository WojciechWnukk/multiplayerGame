package com.gameServer.gameSerwer.Model;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Message {
    private String playerId;
    private Integer x;
    private Integer y;
    private Integer lvl;
    private Boolean online;
}