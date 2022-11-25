package com.example.messenger.controller;

import com.example.messenger.entity.Message;
import com.example.messenger.repository.MessageRepository;
import com.example.messenger.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/chat")
public class ChatController {
    @Autowired
    private UserService userService;

    @Autowired
    private MessageRepository messageRepository;

//    @Autowired
//    private ChatRoomService chatRoomService;

    @GetMapping("")
    public String getChat() {
        return "chat";
    }

    @MessageMapping("/chat.send/{id1}/{id2}")
    @SendTo("/topic/{id1}/{id2}")
    public Message sendMessage(@Payload final Message chatMessage) {
        messageRepository.save(chatMessage);
        return chatMessage;
    }


}
