package com.gameServer.gameSerwer.Repository;

import com.gameServer.gameSerwer.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
