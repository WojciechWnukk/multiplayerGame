package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Model.Entities;

import java.util.List;

public interface EntityService {
    List<Entities> getAllEntities();
    Entities updateEntity(Entities entity);
    Entities addEntity(Entities entity, String playerRole);
    Entities updateEntityByForm(Entities entity, String playerRole);

}
