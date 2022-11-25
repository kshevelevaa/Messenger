package com.example.messenger.repository;

import com.example.messenger.entity.Message;
import com.example.messenger.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(collectionResourceRel = "messages", path = "messages")
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findMessagesById(@Param("id") Long id);

    @Query("select m from message m where (m.userFrom.id = :userFrom and m.userTo.id = :userTo) or (m.userTo.id = :userFrom and m.userFrom.id = :userTo)")
    @RestResource(path = "findChat")
    List<Message> findChat(@Param("userFrom") Long userFrom_id, @Param("userTo") Long userTo_id);
}