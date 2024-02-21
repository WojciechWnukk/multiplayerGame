package com.gameServer.gameSerwer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gameServer.gameSerwer.Model.User;
import com.gameServer.gameSerwer.Service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = GameSerwerApplication.class)
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    public void getAllUsers_ReturnsListOfUsers() throws Exception {
        // Arrange
        List<User> mockUsers = Arrays.asList(
                new User("1", "user1", 0, 0, 1, 33, true, true,"email", "password"),
                new User("2", "user2", 0, 0, 1, 33, true, true,"email", "password")
        );

        Mockito.when(userService.getAllUsers()).thenReturn(mockUsers);

        // Act & Assert
        mockMvc.perform(get("/api/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].id").value("1"))
                .andExpect(jsonPath("$.data[1].id").value("2"));
    }

    @Test
    public void movePlayer_ExistingUser_ReturnsOkStatusAndUserId() throws Exception {
        // Arrange
        String playerId = "1";
        User existingUser = new User(playerId, "user1", 0, 0, 1, 33, true, true,"email", "password");
        User updatedUser = new User(playerId, "user1", 10, 20, 1, 33, true, true,"email", "password");

        Mockito.when(userService.getAllUsers()).thenReturn(List.of(existingUser));
        Mockito.when(userService.updateUserPosition(Mockito.any(User.class))).thenReturn(updatedUser);

        // Act & Assert
        mockMvc.perform(put("/api/users/{playerId}", playerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(playerId));
    }

    @Test
    public void deleteUser_ExistingUser_ReturnsOkStatusAndUserId() throws Exception {
        // Arrange
        String playerId = "1";
        User existingUser = new User(playerId, "user1", 0, 0, 1, 33, true, true, "email", "password");

        Mockito.when(userService.getAllUsers()).thenReturn(List.of(existingUser));
        Mockito.when(userService.deleteUser(Mockito.any(String.class))).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/users/{playerId}", playerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(existingUser)))
                .andExpect(status().isOk());
    }
}
