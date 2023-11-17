package com.gameServer.gameSerwer;

import com.gameServer.gameSerwer.Controller.UserController;
import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Repository.UserRepository;
import com.gameServer.gameSerwer.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.lang.reflect.Array;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class UserControllerTest {

    @Mock
    private UserService userService;
    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

    }

    @Test
    public void getAllUsers_shouldReturnListOfUsers() {
        // Arrange
        User user = new User("1", "user1", 0, 0, 1, true, "email", "password");
        User user2 = new User("2", "user2", 0, 0, 1, true, "email2", "password2");

        userService.addUser(user);
        userService.addUser(user2);
        User[] usersArray = {user, user2};

        when(userService.getAllUsers()).thenReturn(Arrays.asList(usersArray));

        // Act
        System.out.println(userService.getAllUsers());

        // Assert
        assertEquals(Arrays.stream(usersArray).count(), userService.getAllUsers().size());
    }

    @Test
    public void movePlayer_shouldUpdateUserPosition() {
        // Arrange
        User user = new User("1", "user1", 0, 0, 1, true, "email", "password");
        when(userService.updateUserPosition(any(User.class))).thenReturn(user);
        when(userService.getAllUsers()).thenReturn(Collections.singletonList(user));

        System.out.println(userService.getAllUsers());
        User userUpdated = new User("1", "user1", 40, 40, 1, true, "email", "password");
        when(userService.updateUserPosition(any(User.class))).thenReturn(userUpdated);
        when(userService.getAllUsers()).thenReturn(Collections.singletonList(userUpdated));

        // Act
        userService.updateUserPosition(userUpdated);
        System.out.println(userService.getAllUsers());

        Optional<User> actualUser = userService.getUserById("1");

        // Assert
        /*
        assertNotNull(userUpdated);
        assertEquals(userUpdated, userService.getUserById("1"));
        assertEquals(userUpdated.getX(), userUpdated.getX());
        assertEquals(userUpdated.getY(), userUpdated.getY());*/

    }

}
