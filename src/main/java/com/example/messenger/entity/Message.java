package com.example.messenger.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "message")
@Table(name = "messages", schema = "public")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @RestResource(exported = false)
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    private User userFrom;

    @RestResource(exported = false)
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    private User userTo;

    private String content;


    private LocalDateTime sendTime;


}
