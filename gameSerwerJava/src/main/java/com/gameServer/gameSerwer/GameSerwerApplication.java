package com.gameServer.gameSerwer;

import com.gameServer.gameSerwer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class GameSerwerApplication{

	@Autowired
	UserRepository userrepository;

	public static void main(String[] args) {
		SpringApplication.run(GameSerwerApplication.class, args);
	}



}
