package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Model.Entities;
import com.gameServer.gameSerwer.Repository.EntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntityServiceImpl implements EntityService {
    @Autowired
    private EntityRepository entityRepository;

    @Override
    public List<Entities> getAllEntities() {
        return entityRepository.findAll();
    }

    @Override
    public Entities updateEntity(Entities entity) {
        Entities entityToUpdate = entityRepository.findById(entity.getId()).get();
        entityToUpdate.setX(entity.getX());
        entityToUpdate.setY(entity.getY());
        entityToUpdate.setName(entity.getName());
        entityToUpdate.setLvl(entity.getLvl());
        entityToUpdate.setAlive(entity.isAlive());
        entityToUpdate.setRespawnTime(entity.getRespawnTime());
        entityToUpdate.setImage(entity.getImage());
        return entityRepository.save(entityToUpdate);
    }

    @Override
    public Entities addEntity(Entities entity) {
        return entityRepository.save(entity);
    }


}
