package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Model.Entities;
import com.gameServer.gameSerwer.Repository.EntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntityServiceImpl implements EntityService{
    @Autowired
    private EntityRepository entityRepository;

    @Override
    public List<Entities> getAllEntities(){
        return entityRepository.findAll();
    }

    @Override
    public Entities updateEntity(String id, Entities entity){
        Entities entityToUpdate = entityRepository.findById(id).get();
        entityToUpdate.setX(entity.getX());
        entityToUpdate.setY(entity.getY());
        return entityRepository.save(entityToUpdate);
    }

}
