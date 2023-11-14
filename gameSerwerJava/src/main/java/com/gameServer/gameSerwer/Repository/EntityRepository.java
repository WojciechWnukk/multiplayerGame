package com.gameServer.gameSerwer.Repository;

import com.gameServer.gameSerwer.Model.Entities;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EntityRepository extends MongoRepository<Entities, String> {
}
