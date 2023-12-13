package com.gameServer.gameSerwer.Service;

import com.gameServer.gameSerwer.Model.Entities;
import com.gameServer.gameSerwer.Repository.EntityRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.NonNull;
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
    public Entities updateEntity(@Valid Entities entity) {
        validateEntity(entity);

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
    public Entities updateEntityByForm(@Valid Entities entity, String playerRole) {

        if (!playerRole.equals("Admin")) {
            throw new IllegalArgumentException("You don't have permission to update entity");
        }
        validateEntity(entity);

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
    public Entities addEntity(@Valid Entities entity, String playerRole) {
        if (!playerRole.equals("Admin")) {
            throw new IllegalArgumentException("You don't have permission to add entity");
        }
        validateEntity(entity);
        return entityRepository.save(entity);
    }

    private void validateEntity(@Valid Entities entity) {
        validateXY(entity.getX(), entity.getY());
        validateRespawnTime(entity.getRespawnTime());
        validateLvl(entity.getLvl());
        validateNick(entity.getName());
    }

    private void validateXY(@Min(0) @Max(1160) @PositiveOrZero int x, @Min(0) @Max(1160) @PositiveOrZero int y) {
        if (x % 40 != 0 || y % 40 != 0) {
            throw new IllegalArgumentException("Invalid values for x and y. They must be multiples of 40.");
        }
    }

    private void validateRespawnTime(@Min(1) @Max(100) int respawnTime) {
        if (respawnTime < 1 || respawnTime > 100) {
            throw new IllegalArgumentException("Invalid value for respawnTime. It must be between 1 and 100.");
        }
    }

    private void validateLvl(@Min(1) @Max(100) int lvl) {
        if (lvl < 1 || lvl > 100) {
            throw new IllegalArgumentException("Invalid value for lvl. It must be between 1 and 100.");
        }
    }

    private void validateNick(String name) {
        if (name.length() < 3 || name.length() > 20 || name.isEmpty()) {
            throw new IllegalArgumentException("Invalid value for nick. It must be at least 3 characters long.");
        }
    }

}
