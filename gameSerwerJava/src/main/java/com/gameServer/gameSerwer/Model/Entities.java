package com.gameServer.gameSerwer.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class Entities {
    private String id;
    private String name;
    private int x;
    private int y;
    private int lvl;
    private boolean alive;
    private int respawnTime;
    private String image;

}
